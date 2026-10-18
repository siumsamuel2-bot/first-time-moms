variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "github_repo" {
  description = "GitHub repository (owner/repo) for OIDC"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for production domain"
  type        = string
}

variable "api_image" {
  description = "Production API Docker image URI"
  type        = string
}

variable "web_image" {
  description = "Production Web Docker image URI"
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

variable "alarm_email" {
  description = "Email address for alarm notifications"
  type        = string
  default     = ""
}

variable "analytics_salt" {
  description = "Salt for hashing user IDs in analytics export"
  type        = string
  sensitive   = true
}