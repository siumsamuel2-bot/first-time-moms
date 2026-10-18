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

variable "subnet_ids" {
  type        = list(string)
  description = "Subnet OCIDs for load balancer (public subnets)"
}

variable "nsg_ids" {
  type        = list(string)
  description = "NSG OCIDs for load balancer"
  default     = []
}

variable "is_private" {
  type        = bool
  description = "Whether the load balancer is private"
  default     = false
}

variable "min_bandwidth_mbps" {
  type        = number
  description = "Minimum bandwidth in Mbps (flexible shape)"
  default     = 10
}

variable "max_bandwidth_mbps" {
  type        = number
  description = "Maximum bandwidth in Mbps (flexible shape)"
  default     = 100
}

variable "api_private_ips" {
  type        = list(string)
  description = "Private IPs of API instances"
}

variable "web_private_ips" {
  type        = list(string)
  description = "Private IPs of Web instances"
}

variable "api_port" {
  type        = number
  description = "API port"
  default     = 8080
}

variable "web_port" {
  type        = number
  description = "Web port"
  default     = 80
}

variable "certificate_name" {
  type        = string
  description = "Certificate name for HTTPS"
}

variable "domain" {
  type        = string
  description = "Domain name (e.g., api.staging.firstweeks.app)"
}

variable "tags" {
  type        = map(string)
  description = "Additional tags"
  default     = {}
}