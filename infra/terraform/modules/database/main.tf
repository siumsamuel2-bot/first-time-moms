terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
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

resource "random_password" "db_password" {
  length  = 32
  special = false
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = var.database_subnet_ids

  tags = local.tags
}

resource "aws_security_group" "database" {
  name        = "${var.environment}-database-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.ecs_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, { Name = "${var.environment}-database-sg" })
}

resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
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
      Sid    = "AllowRDSAccess"
      Effect = "Allow"
      Principal = {
        Service = "rds.amazonaws.com"
      }
      Action = [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ]
      Resource = "*"
    }]
  })

  tags = local.tags
}

data "aws_caller_identity" "current" {}

resource "aws_db_instance" "main" {
  identifier                = "${var.environment}-firstweeks-db"
  engine                    = "postgres"
  engine_version            = "16.4"
  instance_class            = var.instance_class
  allocated_storage         = var.allocated_storage
  max_allocated_storage     = var.max_allocated_storage
  storage_type              = "gp3"
  storage_encrypted         = true
  kms_key_id                = aws_kms_key.rds.arn
  db_name                   = var.db_name
  username                  = var.db_username
  password                  = var.db_password != "" ? var.db_password : random_password.db_password.result
  db_subnet_group_name      = aws_db_subnet_group.main.name
  vpc_security_group_ids    = [aws_security_group.database.id]
  backup_retention_period   = var.backup_retention_days
  backup_window             = "03:00-04:00"
  maintenance_window        = "sun:04:00-sun:05:00"
  multi_az                  = var.multi_az
  publicly_accessible       = false
  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.environment}-firstweeks-db-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  ca_cert_identifier = "rds-ca-rsa2048-g1"

  performance_insights_enabled          = true
  performance_insights_kms_key_id       = aws_kms_key.rds.arn
  performance_insights_retention_period = 7

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = local.tags
}

resource "aws_iam_role" "rds_monitoring" {
  name = "${var.environment}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "monitoring.rds.amazonaws.com"
      }
    }]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
  ]
}

resource "aws_db_parameter_group" "main" {
  name        = "${var.environment}-postgres16"
  family      = "postgres16"
  description = "Parameter group for PostgreSQL 16"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  parameter {
    name  = "pg_stat_statements.track"
    value = "all"
  }

  parameter {
    name  = "max_connections"
    value = "200"
  }

  tags = local.tags
}

resource "aws_db_instance" "main" {
  identifier                = "${var.environment}-firstweeks-db"
  engine                    = "postgres"
  engine_version            = "16.4"
  instance_class            = var.instance_class
  allocated_storage         = var.allocated_storage
  max_allocated_storage     = var.max_allocated_storage
  storage_type              = "gp3"
  storage_encrypted         = true
  kms_key_id                = aws_kms_key.rds.arn
  db_name                   = var.db_name
  username                  = var.db_username
  password                  = var.db_password != "" ? var.db_password : random_password.db_password.result
  db_subnet_group_name      = aws_db_subnet_group.main.name
  vpc_security_group_ids    = [aws_security_group.database.id]
  backup_retention_period   = var.backup_retention_days
  backup_window             = "03:00-04:00"
  maintenance_window        = "sun:04:00-sun:05:00"
  multi_az                  = var.multi_az
  publicly_accessible       = false
  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.environment}-firstweeks-db-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  ca_cert_identifier      = "rds-ca-rsa2048-g1"
  db_parameter_group_name = aws_db_parameter_group.main.name

  performance_insights_enabled          = true
  performance_insights_kms_key_id       = aws_kms_key.rds.arn
  performance_insights_retention_period = 7

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = local.tags
}

resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.environment}/database-url"
  description = "Database connection URL for ${var.environment}"

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id = aws_secretsmanager_secret.database_url.id
  secret_string = jsonencode({
    url = "postgresql://${var.db_username}:${var.db_password != "" ? var.db_password : random_password.db_password.result}@${aws_db_instance.main.endpoint}/${var.db_name}?sslmode=require"
  })
}