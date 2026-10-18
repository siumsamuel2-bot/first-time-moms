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

variable "vcn_cidr" {
  type        = string
  description = "VCN CIDR block (e.g., 10.0.0.0/16)"
  default     = "10.0.0.0/16"
}

variable "vcn_dns_label" {
  type        = string
  description = "VCN DNS label (max 15 chars, alphanumeric, starts with letter)"
  default     = "firstweeks"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public subnet CIDR blocks"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private subnet CIDR blocks"
  default     = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

variable "database_subnet_cidrs" {
  type        = list(string)
  description = "Database subnet CIDR blocks"
  default     = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
}

variable "tags" {
  type        = map(string)
  description = "Additional tags"
  default     = {}
}