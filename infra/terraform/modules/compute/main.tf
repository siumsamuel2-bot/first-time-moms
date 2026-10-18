terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  tags = merge(
    {
      Environment = var.environment
      ManagedBy   = "terraform"
      Project     = "firstweeks"
    },
    var.tags
  )
}

data "aws_iam_policy_document" "ecs_task_execution" {
  statement {
    sid    = "ECRPullAccess"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "CloudWatchLogsAccess"
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "arn:aws:logs:${var.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/ecs/${var.environment}*"
    ]
  }

  statement {
    sid    = "SecretsManagerAccess"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]
    resources = [
      "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}*"
    ]
  }

  statement {
    sid    = "KMSDecrypt"
    effect = "Allow"
    actions = [
      "kms:Decrypt"
    ]
    resources = [
      var.kms_key_arn
    ]
    condition {
      test     = "StringEquals"
      variable = "kms:ViaService"
      values   = ["secretsmanager.${var.region}.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_task" {
  statement {
    sid    = "SecretsManagerAccess"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]
    resources = [
      "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}*"
    ]
  }

  statement {
    sid    = "KMSDecrypt"
    effect = "Allow"
    actions = [
      "kms:Decrypt"
    ]
    resources = [
      var.kms_key_arn
    ]
    condition {
      test     = "StringEquals"
      variable = "kms:ViaService"
      values   = ["secretsmanager.${var.region}.amazonaws.com"]
    }
  }

  statement {
    sid    = "S3Access"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]
    resources = [
      var.analytics_bucket_arn,
      "${var.analytics_bucket_arn}/*"
    ]
  }
}

data "aws_caller_identity" "current" {}

resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-firstweeks"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      kms_key_id = var.kms_key_arn
      log_configuration {
        cloud_watch_log_group_name = "/aws/ecs/${var.environment}/exec-command"
      }
    }
  }

  tags = local.tags
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
  default_capacity_provider_strategy {
    base              = 1
    capacity_provider = "FARGATE"
    weight            = 100
  }
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.environment}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  inline_policy {
    name   = "ecs-task-execution-policy"
    policy = data.aws_iam_policy_document.ecs_task_execution.json
  }
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  inline_policy {
    name   = "ecs-task-policy"
    policy = data.aws_iam_policy_document.ecs_task.json
  }
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/aws/ecs/${var.environment}"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "exec_command" {
  name              = "/aws/ecs/${var.environment}/exec-command"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${var.environment}-firstweeks-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.api_cpu
  memory                   = var.api_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([{
    name      = "api"
    image     = var.api_image
    cpu       = var.api_cpu
    memory    = var.api_memory
    essential = true
    portMappings = [{
      containerPort = var.api_port
      protocol      = "tcp"
    }]
    environment = [
      { name = "NODE_ENV", value = var.environment },
      { name = "PORT", value = var.api_port },
      { name = "HOST", value = "0.0.0.0" },
      { name = "CORS_ORIGIN", value = var.cors_origin },
      { name = "RATE_LIMIT_MAX", value = "100" },
      { name = "RATE_LIMIT_WINDOW", value = "1 minute" },
      { name = "BCRYPT_ROUNDS", value = "12" },
    ]
    secrets = [
      { name = "DATABASE_URL", valueFrom = "${var.secrets_prefix}/database-url" },
      { name = "JWT_SECRET", valueFrom = "${var.secrets_prefix}/jwt-secret" },
      { name = "JWT_ACCESS_TTL", valueFrom = "${var.secrets_prefix}/jwt-access-ttl" },
      { name = "JWT_REFRESH_TTL", valueFrom = "${var.secrets_prefix}/jwt-refresh-ttl" },
      { name = "PUSH_VAPID_PUBLIC_KEY", valueFrom = "${var.secrets_prefix}/push-vapid-public-key" },
      { name = "PUSH_VAPID_PRIVATE_KEY", valueFrom = "${var.secrets_prefix}/push-vapid-private-key" },
      { name = "PUSH_VAPID_SUBJECT", valueFrom = "${var.secrets_prefix}/push-vapid-subject" },
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/aws/ecs/${var.environment}"
        "awslogs-region"        = var.region
        "awslogs-stream-prefix" = "api"
      }
    }
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:${var.api_port}/healthz || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])

  tags = local.tags
}

resource "aws_ecs_task_definition" "web" {
  family                   = "${var.environment}-firstweeks-web"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.web_cpu
  memory                   = var.web_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([{
    name      = "web"
    image     = var.web_image
    cpu       = var.web_cpu
    memory    = var.web_memory
    essential = true
    portMappings = [{
      containerPort = var.web_port
      protocol      = "tcp"
    }]
    environment = [
      { name = "NODE_ENV", value = var.environment },
      { name = "PORT", value = var.web_port },
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/aws/ecs/${var.environment}"
        "awslogs-region"        = var.region
        "awslogs-stream-prefix" = "web"
      }
    }
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:${var.web_port}/healthz || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 30
    }
  }])

  tags = local.tags
}

resource "aws_ecs_service" "api" {
  name            = "${var.environment}-firstweeks-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.api_desired_count
  launch_type     = "FARGATE"
  deployment_controller {
    type = "ECS"
  }
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.api_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.api_target_group_arn
    container_name   = "api"
    container_port   = var.api_port
  }

  service_registries {
    registry_arn = aws_servicediscovery_service.api.arn
    port         = var.api_port
  }

  tags = local.tags
}

resource "aws_ecs_service" "web" {
  name            = "${var.environment}-firstweeks-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.web.arn
  desired_count   = var.web_desired_count
  launch_type     = "FARGATE"
  deployment_controller {
    type = "ECS"
  }
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.web_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.web_target_group_arn
    container_name   = "web"
    container_port   = var.web_port
  }

  service_registries {
    registry_arn = aws_servicediscovery_service.web.arn
    port         = var.web_port
  }

  tags = local.tags
}

resource "aws_servicediscovery_namespace" "internal" {
  name        = "${var.environment}.internal"
  description = "Internal service discovery for ${var.environment}"

  vpc = var.vpc_id

  type = "DNS_PRIVATE"
}

resource "aws_servicediscovery_service" "api" {
  name         = "api"
  namespace_id = aws_servicediscovery_namespace.internal.id
  dns_config {
    namespace_id   = aws_servicediscovery_namespace.internal.id
    routing_policy = "MULTIVALUE"
    dns_records {
      type = "A"
      ttl  = 60
    }
  }
  health_check_custom_config {
    failure_threshold = 3
  }
}

resource "aws_servicediscovery_service" "web" {
  name         = "web"
  namespace_id = aws_servicediscovery_namespace.internal.id
  dns_config {
    namespace_id   = aws_servicediscovery_namespace.internal.id
    routing_policy = "MULTIVALUE"
    dns_records {
      type = "A"
      ttl  = 60
    }
  }
  health_check_custom_config {
    failure_threshold = 3
  }
}