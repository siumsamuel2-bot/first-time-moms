variable "compartment_ocid" {
  description = "Compartment OCID"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "tags" {
  description = "Freeform tags applied to all resources"
  type        = map(string)
}

variable "db_admin_password" {
  description = "ADMIN password for the Autonomous Database"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Autonomous Database name (letters and numbers only)"
  type        = string
}

variable "db_display_name" {
  description = "Autonomous Database display name"
  type        = string
}
