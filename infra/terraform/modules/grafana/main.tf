terraform {
  required_version = ">= 1.5"
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = "~> 3.0"
    }
  }
}

provider "grafana" {
  url  = var.grafana_url
  auth = var.grafana_auth
}

locals {
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = "firstweeks"
  }
}

resource "grafana_folder" "firstweeks" {
  title = "Firstweeks - ${var.environment}"
}

resource "grafana_dashboard" "overview" {
  folder_uid = grafana_folder.firstweeks.uid
  json = templatefile("${path.module}/dashboards/overview.json.tpl", {
    environment    = var.environment
    cluster_name   = var.ecs_cluster_name
    alb_name       = var.alb_name
    db_instance_id = var.db_instance_id
  })
}

resource "grafana_dashboard" "api" {
  folder_uid = grafana_folder.firstweeks.uid
  json = templatefile("${path.module}/dashboards/api.json.tpl", {
    environment  = var.environment
    cluster_name = var.ecs_cluster_name
  })
}

resource "grafana_dashboard" "web" {
  folder_uid = grafana_folder.firstweeks.uid
  json = templatefile("${path.module}/dashboards/web.json.tpl", {
    environment  = var.environment
    cluster_name = var.ecs_cluster_name
  })
}

resource "grafana_dashboard" "database" {
  folder_uid = grafana_folder.firstweeks.uid
  json = templatefile("${path.module}/dashboards/database.json.tpl", {
    environment    = var.environment
    db_instance_id = var.db_instance_id
  })
}

resource "grafana_dashboard" "business" {
  folder_uid = grafana_folder.firstweeks.uid
  json = templatefile("${path.module}/dashboards/business.json.tpl", {
    environment = var.environment
  })
}

resource "grafana_notification_channel" "slack" {
  count = var.slack_webhook_url != "" ? 1 : 0
  type  = "slack"
  name  = "${var.environment}-slack-alerts"
  settings = {
    url = var.slack_webhook_url
  }
}

resource "grafana_notification_channel" "pagerduty" {
  count = var.pagerduty_integration_key != "" ? 1 : 1
  type  = "pagerduty"
  name  = "${var.environment}-pagerduty-alerts"
  settings = {
    integrationKey = var.pagerduty_integration_key
  }
}

resource "grafana_alert_rule" "api_high_cpu" {
  folder_uid = grafana_folder.firstweeks.uid
  rule_group = "Firstweeks API Alerts"
  title      = "API High CPU Usage"
  condition  = "A"
  data = [{
    refId         = "A"
    datasourceUid = var.prometheus_datasource_uid
    model = {
      expr         = "avg(ecs_service_cpu_utilization{cluster_name=\"${var.ecs_cluster_name}\",service_name=\"${var.environment}-firstweeks-api\"}) > 80"
      intervalMs   = 60000
      legendFormat = "API CPU %"
      refId        = "A"
    }
  }]
  for = "5m"
  annotations = {
    summary     = "API CPU usage is above 80%"
    description = "The API service CPU utilization has been above 80% for more than 5 minutes."
  }
  labels = {
    severity    = "warning"
    service     = "api"
    environment = var.environment
  }
  notifications = var.pagerduty_integration_key != "" ? [grafana_notification_channel.pagerduty[0].id] : []
}

resource "grafana_alert_rule" "web_high_cpu" {
  folder_uid = grafana_folder.firstweeks.uid
  rule_group = "Firstweeks Web Alerts"
  title      = "Web High CPU Usage"
  condition  = "A"
  data = [{
    refId         = "A"
    datasourceUid = var.prometheus_datasource_uid
    model = {
      expr         = "avg(ecs_service_cpu_utilization{cluster_name=\"${var.ecs_cluster_name}\",service_name=\"${var.environment}-firstweeks-web\"}) > 80"
      intervalMs   = 60000
      legendFormat = "Web CPU %"
      refId        = "A"
    }
  }]
  for = "5m"
  annotations = {
    summary     = "Web CPU usage is above 80%"
    description = "The Web service CPU utilization has been above 80% for more than 5 minutes."
  }
  labels = {
    severity    = "warning"
    service     = "web"
    environment = var.environment
  }
  notifications = var.pagerduty_integration_key != "" ? [grafana_notification_channel.pagerduty[0].id] : []
}

resource "grafana_alert_rule" "alb_5xx_errors" {
  folder_uid = grafana_folder.firstweeks.uid
  rule_group = "Firstweeks ALB Alerts"
  title      = "ALB 5xx Errors"
  condition  = "A"
  data = [{
    refId         = "A"
    datasourceUid = var.prometheus_datasource_uid
    model = {
      expr         = "sum(rate(aws_alb_httpcode_target_5xx_count{load_balancer=\"${var.alb_name}\"}[1m])) > 0.1"
      intervalMs   = 60000
      legendFormat = "5xx Rate"
      refId        = "A"
    }
  }]
  for = "2m"
  annotations = {
    summary     = "ALB returning 5xx errors"
    description = "The Application Load Balancer is returning 5xx errors at a rate of > 0.1 per second."
  }
  labels = {
    severity    = "critical"
    service     = "alb"
    environment = var.environment
  }
  notifications = var.pagerduty_integration_key != "" ? [grafana_notification_channel.pagerduty[0].id] : []
}

resource "grafana_alert_rule" "rds_high_cpu" {
  folder_uid = grafana_folder.firstweeks.uid
  rule_group = "Firstweeks Database Alerts"
  title      = "RDS High CPU Usage"
  condition  = "A"
  data = [{
    refId         = "A"
    datasourceUid = var.prometheus_datasource_uid
    model = {
      expr         = "aws_rds_cpu_utilization{db_instance_identifier=\"${var.db_instance_id}\"} > 80"
      intervalMs   = 60000
      legendFormat = "RDS CPU %"
      refId        = "A"
    }
  }]
  for = "5m"
  annotations = {
    summary     = "RDS CPU usage is above 80%"
    description = "The RDS instance CPU utilization has been above 80% for more than 5 minutes."
  }
  labels = {
    severity    = "warning"
    service     = "database"
    environment = var.environment
  }
  notifications = var.pagerduty_integration_key != "" ? [grafana_notification_channel.pagerduty[0].id] : []
}

resource "grafana_alert_rule" "rds_low_storage" {
  folder_uid = grafana_folder.firstweeks.uid
  rule_group = "Firstweeks Database Alerts"
  title      = "RDS Low Storage"
  condition  = "A"
  data = [{
    refId         = "A"
    datasourceUid = var.prometheus_datasource_uid
    model = {
      expr         = "aws_rds_free_storage_space{db_instance_identifier=\"${var.db_instance_id}\"} < 10737418240"
      intervalMs   = 300000
      legendFormat = "Free Storage (bytes)"
      refId        = "A"
    }
  }]
  for = "1m"
  annotations = {
    summary     = "RDS free storage is below 10GB"
    description = "The RDS instance has less than 10GB of free storage space."
  }
  labels = {
    severity    = "critical"
    service     = "database"
    environment = var.environment
  }
  notifications = var.pagerduty_integration_key != "" ? [grafana_notification_channel.pagerduty[0].id] : []
}

resource "grafana_alert_rule" "api_unhealthy_tasks" {
  folder_uid = grafana_folder.firstweeks.uid
  rule_group = "Firstweeks API Alerts"
  title      = "API Unhealthy Tasks"
  condition  = "A"
  data = [{
    refId         = "A"
    datasourceUid = var.prometheus_datasource_uid
    model = {
      expr         = "ecs_service_running_task_count{cluster_name=\"${var.ecs_cluster_name}\",service_name=\"${var.environment}-firstweeks-api\"} < 2"
      intervalMs   = 60000
      legendFormat = "Running Tasks"
      refId        = "A"
    }
  }]
  for = "2m"
  annotations = {
    summary     = "API has fewer than 2 running tasks"
    description = "The API service has fewer than the desired 2 running tasks."
  }
  labels = {
    severity    = "critical"
    service     = "api"
    environment = var.environment
  }
  notifications = var.pagerduty_integration_key != "" ? [grafana_notification_channel.pagerduty[0].id] : []
}