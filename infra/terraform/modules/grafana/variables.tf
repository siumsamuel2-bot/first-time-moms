variable "environment" {
  description = "Environment name"
  type        = string
}

variable "grafana_url" {
  description = "Grafana Cloud URL"
  type        = string
}

variable "grafana_auth" {
  description = "Grafana Cloud API key"
  type        = string
  sensitive   = true
}

variable "ecs_cluster_name" {
  description = "ECS cluster name"
  type        = string
}

variable "alb_name" {
  description = "ALB name"
  type        = string
}

variable "db_instance_id" {
  description = "RDS instance identifier"
  type        = string
}

variable "prometheus_datasource_uid" {
  description = "Prometheus data source UID in Grafana"
  type        = string
  default     = "prometheus"
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for notifications (optional)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "pagerduty_integration_key" {
  description = "PagerDuty integration key for notifications (optional)"
  type        = string
  default     = ""
  sensitive   = true
}