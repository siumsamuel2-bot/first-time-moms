variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "api_security_group_id" {
  description = "API security group ID"
  type        = string
}

variable "web_security_group_id" {
  description = "Web security group ID"
  type        = string
}

variable "api_target_group_arn" {
  description = "API target group ARN"
  type        = string
}

variable "web_target_group_arn" {
  description = "Web target group ARN"
  type        = string
}

variable "api_image" {
  description = "API Docker image URI"
  type        = string
}

variable "web_image" {
  description = "Web Docker image URI"
  type        = string
}

variable "api_cpu" {
  description = "API task CPU units"
  type        = number
  default     = 512
}

variable "api_memory" {
  description = "API task memory (MiB)"
  type        = number
  default     = 1024
}

variable "api_desired_count" {
  description = "API desired task count"
  type        = number
  default     = 2
}

variable "api_port" {
  description = "API container port"
  type        = number
  default     = 8080
}

variable "web_cpu" {
  description = "Web task CPU units"
  type        = number
  default     = 256
}

variable "web_memory" {
  description = "Web task memory (MiB)"
  type        = number
  default     = 512
}

variable "web_desired_count" {
  description = "Web desired task count"
  type        = number
  default     = 2
}

variable "web_port" {
  description = "Web container port"
  type        = number
  default     = 8080
}

variable "cors_origin" {
  description = "CORS origin for API"
  type        = string
}

variable "secrets_prefix" {
  description = "Secrets Manager prefix"
  type        = string
  default     = "firstweeks"
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption"
  type        = string
}

variable "analytics_bucket_arn" {
  description = "Analytics S3 bucket ARN"
  type        = string
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}