variable "region" {
  type        = string
  description = "OCI region (e.g., us-phoenix-1, us-ashburn-1)"
  default     = "us-phoenix-1"
}

variable "tenancy_id" {
  type        = string
  description = "OCI tenancy OCID"
}

variable "compartment_id" {
  type        = string
  description = "OCI compartment OCID"
}

variable "namespace" {
  type        = string
  description = "Object Storage namespace (tenancy-wide)"
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key for instance access"
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

variable "push_vapid_subject" {
  type        = string
  description = "VAPID subject (mailto:)"
  default     = "mailto:admin@firstweeks.app"
}

variable "analytics_salt" {
  type        = string
  description = "Salt for analytics de-identification"
  sensitive   = true
}

variable "certificate_name" {
  type        = string
  description = "Certificate name for HTTPS (OCI certificate)"
}

variable "domain" {
  type        = string
  description = "Domain name for staging (e.g., api.staging.firstweeks.app)"
}

variable "api_image" {
  type        = string
  description = "Docker image for API"
}

variable "web_image" {
  type        = string
  description = "Docker image for Web"
}

variable "alarm_email" {
  type        = string
  description = "Email address for alarm notifications"
  default     = ""
}