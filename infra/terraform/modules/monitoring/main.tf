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

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/ecs/${var.environment}/api"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "web" {
  name              = "/aws/ecs/${var.environment}/web"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "scheduler" {
  name              = "/aws/ecs/${var.environment}/scheduler"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "rds" {
  name              = "/aws/rds/${var.environment}/postgresql"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "rds_upgrade" {
  name              = "/aws/rds/${var.environment}/upgrade"
  retention_in_days = 30

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "api_high_cpu" {
  alarm_name          = "${var.environment}-api-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "API CPU utilization > 80% for 2 periods"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = "${var.environment}-firstweeks-api"
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "api_high_memory" {
  alarm_name          = "${var.environment}-api-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "API memory utilization > 80% for 2 periods"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = "${var.environment}-firstweeks-api"
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "web_high_cpu" {
  alarm_name          = "${var.environment}-web-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Web CPU utilization > 80% for 2 periods"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = "${var.environment}-firstweeks-web"
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "web_high_memory" {
  alarm_name          = "${var.environment}-web-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Web memory utilization > 80% for 2 periods"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = "${var.environment}-firstweeks-web"
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "alb_5xx_errors" {
  alarm_name          = "${var.environment}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "ALB 5xx errors > 10 in 1 minute"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    LoadBalancer = var.alb_name
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "alb_high_latency" {
  alarm_name          = "${var.environment}-alb-high-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "ALB target response time > 1s for 2 periods"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    LoadBalancer = var.alb_name
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "rds_high_cpu" {
  alarm_name          = "${var.environment}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "RDS CPU utilization > 80% for 2 periods"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = var.db_instance_id
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "rds_low_storage" {
  alarm_name          = "${var.environment}-rds-low-storage"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 10737418240
  alarm_description   = "RDS free storage < 10GB"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = var.db_instance_id
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "rds_high_connections" {
  alarm_name          = "${var.environment}-rds-high-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 60
  statistic           = "Average"
  threshold           = 150
  alarm_description   = "RDS connections > 150 for 2 periods"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = var.db_instance_id
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "api_unhealthy_tasks" {
  alarm_name          = "${var.environment}-api-unhealthy-tasks"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "RunningTaskCount"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Minimum"
  threshold           = 1
  alarm_description   = "API running tasks < 2 (desired count)"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = "${var.environment}-firstweeks-api"
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "web_unhealthy_tasks" {
  alarm_name          = "${var.environment}-web-unhealthy-tasks"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "RunningTaskCount"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Minimum"
  threshold           = 1
  alarm_description   = "Web running tasks < 2 (desired count)"
  alarm_actions       = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
  ok_actions          = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = "${var.environment}-firstweeks-web"
  }

  tags = local.tags
}

resource "aws_sns_topic" "alarms" {
  name = "${var.environment}-alarms"

  tags = local.tags
}

resource "aws_sns_topic_subscription" "email" {
  count     = var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.alarms.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}