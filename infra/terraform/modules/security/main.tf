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

resource "aws_kms_key" "main" {
  description             = "KMS key for ${var.environment} environment"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowRootAccess"
      Effect = "Allow"
      Principal = {
        AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
      }
      Action   = "kms:*"
      Resource = "*"
      }, {
      Sid    = "AllowECSTasksAccess"
      Effect = "Allow"
      Principal = {
        AWS = "*"
      }
      Action = [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ]
      Resource = "*"
      Condition = {
        StringEquals = {
          "kms:ViaService" = [
            "secretsmanager.${var.region}.amazonaws.com",
            "s3.${var.region}.amazonaws.com"
          ]
        }
      }
    }]
  })

  tags = local.tags
}

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "github_actions" {
  name = "${var.environment}-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:*"
        }
      }
    }]
  })

  tags = local.tags
}

resource "aws_iam_policy" "github_actions_deploy" {
  name = "${var.environment}-github-actions-deploy-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "ECRAccess"
      Effect = "Allow"
      Action = [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ]
      Resource = "*"
      }, {
      Sid    = "ECSDeployAccess"
      Effect = "Allow"
      Action = [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:ListTaskDefinitions"
      ]
      Resource = [
        "arn:aws:ecs:${var.region}:${data.aws_caller_identity.current.account_id}:service/${var.ecs_cluster_name}/*",
        "arn:aws:ecs:${var.region}:${data.aws_caller_identity.current.account_id}:task-definition/${var.environment}-firstweeks-*"
      ]
      }, {
      Sid    = "IAMPassRole"
      Effect = "Allow"
      Action = "iam:PassRole"
      Resource = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${var.environment}-ecs-task-execution-role",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${var.environment}-ecs-task-role"
      ]
      }, {
      Sid    = "SecretsManagerAccess"
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue",
        "secretsmanager:PutSecretValue",
        "secretsmanager:CreateSecret",
        "secretsmanager:UpdateSecret"
      ]
      Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}*"
      }, {
      Sid      = "KMSDecrypt"
      Effect   = "Allow"
      Action   = "kms:Decrypt"
      Resource = aws_kms_key.main.arn
    }]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "github_actions" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_actions_deploy.arn
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
    name = "ecr-and-logs-access"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [{
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
        }, {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/ecs/${var.environment}*"
        }, {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}*"
        }, {
        Effect   = "Allow"
        Action   = "kms:Decrypt"
        Resource = aws_kms_key.main.arn
        Condition = {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${var.region}.amazonaws.com"
          }
        }
      }]
    })
  }

  tags = local.tags
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
    name = "app-permissions"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [{
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}*"
        }, {
        Effect   = "Allow"
        Action   = "kms:Decrypt"
        Resource = aws_kms_key.main.arn
        Condition = {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${var.region}.amazonaws.com"
          }
        }
        }, {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          var.analytics_bucket_arn,
          "${var.analytics_bucket_arn}/*"
        ]
      }]
    })
  }

  tags = local.tags
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name        = "${var.environment}/jwt-secret"
  description = "JWT secret for ${var.environment}"

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret != "" ? var.jwt_secret : random_string.jwt_secret.result
}

resource "aws_secretsmanager_secret" "jwt_access_ttl" {
  name        = "${var.environment}/jwt-access-ttl"
  description = "JWT access token TTL for ${var.environment}"

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "jwt_access_ttl" {
  secret_id     = aws_secretsmanager_secret.jwt_access_ttl.id
  secret_string = "15m"
}

resource "aws_secretsmanager_secret" "jwt_refresh_ttl" {
  name        = "${var.environment}/jwt-refresh-ttl"
  description = "JWT refresh token TTL for ${var.environment}"

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "jwt_refresh_ttl" {
  secret_id     = aws_secretsmanager_secret.jwt_refresh_ttl.id
  secret_string = "7d"
}

resource "aws_secretsmanager_secret" "push_vapid_public_key" {
  name        = "${var.environment}/push-vapid-public-key"
  description = "VAPID public key for push notifications"

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "push_vapid_public_key" {
  secret_id     = aws_secretsmanager_secret.push_vapid_public_key.id
  secret_string = var.push_vapid_public_key
}

resource "aws_secretsmanager_secret" "push_vapid_private_key" {
  name        = "${var.environment}/push-vapid-private-key"
  description = "VAPID private key for push notifications"

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "push_vapid_private_key" {
  secret_id     = aws_secretsmanager_secret.push_vapid_private_key.id
  secret_string = var.push_vapid_private_key
}

resource "aws_secretsmanager_secret" "push_vapid_subject" {
  name        = "${var.environment}/push-vapid-subject"
  description = "VAPID subject for push notifications"

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "push_vapid_subject" {
  secret_id     = aws_secretsmanager_secret.push_vapid_subject.id
  secret_string = "mailto:admin@firstweeks.app"
}

resource "random_string" "jwt_secret" {
  length           = 64
  special          = false
  override_special = "_-"
}

resource "aws_iam_policy" "readonly_metrics" {
  name = "${var.environment}-readonly-metrics"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "cloudwatch:GetMetricData",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics",
        "logs:GetLogEvents",
        "logs:FilterLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ]
      Resource = "*"
    }]
  })

  tags = local.tags
}

resource "aws_guardduty_detector" "main" {
  enable                       = true
  finding_publishing_frequency = "FIFTEEN_MINUTES"

  tags = local.tags
}

resource "aws_config_configuration_recorder" "main" {
  name     = "${var.environment}-config-recorder"
  role_arn = aws_iam_role.config.arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }
}

resource "aws_iam_role" "config" {
  name = "${var.environment}-config-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "config.amazonaws.com"
      }
    }]
  })

  inline_policy {
    name = "config-permissions"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [{
        Effect = "Allow"
        Action = [
          "config:PutConfigRule",
          "config:PutConfigurationRecorder",
          "config:PutDeliveryChannel",
          "config:StartConfigurationRecorder"
        ]
        Resource = "*"
      }]
    })
  }
}

resource "aws_config_delivery_channel" "main" {
  name           = "${var.environment}-delivery-channel"
  s3_bucket_name = var.config_bucket_id
}

resource "aws_config_config_rule" "encrypted_volumes" {
  name = "${var.environment}-encrypted-volumes"
  source {
    owner             = "AWS"
    source_identifier = "ENCRYPTED_VOLUMES"
  }
}

resource "aws_config_config_rule" "rds_storage_encrypted" {
  name = "${var.environment}-rds-storage-encrypted"
  source {
    owner             = "AWS"
    source_identifier = "RDS_STORAGE_ENCRYPTED"
  }
}

resource "aws_config_config_rule" "s3_bucket_public_read_prohibited" {
  name = "${var.environment}-s3-bucket-public-read-prohibited"
  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_PUBLIC_READ_PROHIBITED"
  }
}

resource "aws_config_config_rule" "s3_bucket_public_write_prohibited" {
  name = "${var.environment}-s3-bucket-public-write-prohibited"
  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_PUBLIC_WRITE_PROHIBITED"
  }
}