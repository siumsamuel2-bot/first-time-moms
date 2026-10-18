variable "environment" {
  description = "Environment name (e.g., production, staging)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_id" {
  description = "VPC ID for Lambda VPC configuration"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for Lambda VPC configuration"
  type        = list(string)
}

variable "analytics_bucket_arn" {
  description = "Analytics S3 bucket ARN"
  type        = string
}

variable "analytics_bucket_name" {
  description = "Analytics S3 bucket name"
  type        = string
}

variable "analytics_salt" {
  description = "Salt for hashing user IDs in analytics export"
  type        = string
  sensitive   = true
}

variable "database_url_secret_arn" {
  description = "Secrets Manager secret ARN for database URL"
  type        = string
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption"
  type        = string
}

variable "lambda_source_path" {
  description = "Path to Lambda source code directory"
  type        = string
  default     = "../../../apps/api/dist"
}

variable "lambda_output_path" {
  description = "Path for Lambda deployment package output"
  type        = string
  default     = "../../../apps/api/dist/analytics-lambda.zip"
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}