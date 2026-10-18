terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
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

data "archive_file" "analytics_lambda" {
  type        = "zip"
  source_dir  = var.lambda_source_path
  output_path = var.lambda_output_path
}

resource "aws_iam_role" "analytics_lambda" {
  name = "${var.environment}-analytics-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = local.tags
}

resource "aws_iam_role_policy" "analytics_lambda" {
  name = "${var.environment}-analytics-lambda-policy"
  role = aws_iam_role.analytics_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${var.environment}-analytics-export*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}*"
      },
      {
        Effect   = "Allow"
        Action   = "kms:Decrypt"
        Resource = var.kms_key_arn
        Condition = {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${var.region}.amazonaws.com"
          }
        }
      },
      {
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
      },

      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      }
    ]
  })
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_function" "analytics_export" {
  function_name = "${var.environment}-analytics-export"
  description   = "Weekly de-identified analytics export for Firstweeks"
  role          = aws_iam_role.analytics_lambda.arn
  runtime       = "nodejs20.x"
  handler       = "dist/lambda/analytics-export-handler.handler"
  timeout       = 300
  memory_size   = 1024
  architectures = ["x86_64"]

  filename         = data.archive_file.analytics_lambda.output_path
  source_code_hash = data.archive_file.analytics_lambda.output_base64sha256

  environment {
    variables = {
      NODE_ENV            = var.environment
      AWS_REGION          = var.region
      ANALYTICS_BUCKET    = var.analytics_bucket_name
      ANALYTICS_SALT      = var.analytics_salt
      DATABASE_URL_SECRET = "${var.environment}/database-url"
      JWT_SECRET_NAME     = "${var.environment}/jwt-secret"
    }
  }

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }

  tags = local.tags
}

resource "aws_security_group" "analytics_lambda" {
  name        = "${var.environment}-analytics-lambda-sg"
  description = "Security group for analytics Lambda"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, { Name = "${var.environment}-analytics-lambda-sg" })
}

resource "aws_cloudwatch_log_group" "analytics_lambda" {
  name              = "/aws/lambda/${var.environment}-analytics-export"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_eventbridge_rule" "daily_analytics_export" {
  name                = "${var.environment}-daily-analytics-export"
  description         = "Trigger daily analytics export at 2 AM UTC"
  schedule_expression = "cron(0 2 * * ? *)"

  tags = local.tags
}

resource "aws_eventbridge_target" "analytics_lambda" {
  rule           = aws_eventbridge_rule.daily_analytics_export.name
  arn            = aws_lambda_function.analytics_export.arn
  event_bus_name = "default"
}

resource "aws_lambda_permission" "eventbridge_invoke" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analytics_export.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_eventbridge_rule.daily_analytics_export.arn
}

output "analytics_lambda_arn" {
  description = "Analytics export Lambda ARN"
  value       = aws_lambda_function.analytics_export.arn
}

output "analytics_lambda_name" {
  description = "Analytics export Lambda function name"
  value       = aws_lambda_function.analytics_export.function_name
}

output "eventbridge_rule_arn" {
  description = "EventBridge rule ARN for daily analytics export"
  value       = aws_eventbridge_rule.daily_analytics_export.arn
}