variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository (owner/repo) for OIDC"
  type        = string
}

variable "ecs_cluster_name" {
  description = "ECS cluster name"
  type        = string
}

variable "analytics_bucket_arn" {
  description = "Analytics S3 bucket ARN"
  type        = string
}

variable "jwt_secret" {
  description = "JWT secret (optional, will be generated if not provided)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "push_vapid_public_key" {
  description = "VAPID public key for push notifications"
  type        = string
  default     = ""
  sensitive   = true
}

variable "push_vapid_private_key" {
  description = "VAPID private key for push notifications"
  type        = string
  default     = ""
  sensitive   = true
}

variable "config_bucket_id" {
  description = "S3 bucket for AWS Config"
  type        = string
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}