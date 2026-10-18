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

variable "public_subnet_ids" {
  description = "Public subnet IDs"
  type        = list(string)
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
}

variable "access_logs_bucket_id" {
  description = "S3 bucket ID for ALB access logs"
  type        = string
}

variable "api_target_ips" {
  description = "API task IP addresses (for target group attachment)"
  type        = list(string)
  default     = []
}

variable "web_target_ips" {
  description = "Web task IP addresses (for target group attachment)"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}