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

variable "api_instance_ids" {
  type        = list(string)
  description = "OCIDs of API instances"
}

variable "web_instance_ids" {
  type        = list(string)
  description = "OCIDs of Web instances"
}

variable "load_balancer_id" {
  type        = string
  description = "OCID of the load balancer"
}

variable "database_id" {
  type        = string
  description = "OCID of the database"
}

variable "cpu_threshold" {
  type        = number
  description = "CPU utilization threshold percentage"
  default     = 80
}

variable "memory_threshold" {
  type        = number
  description = "Memory utilization threshold percentage"
  default     = 80
}

variable "latency_threshold" {
  type        = number
  description = "Latency threshold in milliseconds"
  default     = 1000
}

variable "error_threshold" {
  type        = number
  description = "5xx error count threshold per minute"
  default     = 10
}

variable "db_cpu_threshold" {
  type        = number
  description = "Database CPU utilization threshold percentage"
  default     = 80
}

variable "db_storage_threshold" {
  type        = number
  description = "Database storage utilization threshold percentage"
  default     = 80
}

variable "alarm_email" {
  type        = string
  description = "Email address for alarm notifications"
  default     = ""
}

variable "alarm_topic_id" {
  type        = string
  description = "Existing ONS topic OCID for alarms (optional)"
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Additional tags"
  default     = {}
}