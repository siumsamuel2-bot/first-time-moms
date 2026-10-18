variable "environment" {
  type        = string
  description = "Environment name (staging, production)"
}

variable "region" {
  type        = string
  description = "OCI region (e.g., us-phoenix-1, us-ashburn-1)"
}

variable "compartment_id" {
  type        = string
  description = "OCI compartment OCID"
}

variable "namespace" {
  type        = string
  description = "Object Storage namespace (tenancy-wide)"
}

variable "tags" {
  type        = map(string)
  description = "Additional tags"
  default     = {}
}