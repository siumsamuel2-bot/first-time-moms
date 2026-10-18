variable "environment" {
  type        = string
  description = "Environment name (staging, production)"
}

variable "region" {
  type        = string
  description = "OCI region (e.g., us-phoenix-1, us-ashburn-1)"
}

variable "tenancy_id" {
  type        = string
  description = "OCI tenancy OCID"
}

variable "compartment_id" {
  type        = string
  description = "OCI compartment OCID"
}

variable "jwt_secret" {
  type        = string
  description = "JWT secret key"
  sensitive   = true
}

variable "push_vapid_public_key" {
  type        = string
  description = "VAPID public key for push notifications"
  sensitive   = true
}

variable "push_vapid_private_key" {
  type        = string
  description = "VAPID private key for push notifications"
  sensitive   = true
}

variable "analytics_salt" {
  type        = string
  description = "Salt for analytics de-identification"
  sensitive   = true
}

variable "github_repo" {
  type        = string
  description = "GitHub repository for OIDC (e.g., org/repo)"
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Additional tags"
  default     = {}
}