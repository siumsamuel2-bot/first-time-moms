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

variable "database_subnet_id" {
  type        = string
  description = "Subnet OCID for database"
}

variable "database_nsg_ids" {
  type        = list(string)
  description = "NSG OCIDs for database"
  default     = []
}

variable "db_name" {
  type        = string
  description = "Database name"
  default     = "firstweeks"
}

variable "db_user" {
  type        = string
  description = "Database admin user"
  default     = "admin"
}

variable "db_password" {
  type        = string
  description = "Database admin password (auto-generated if empty)"
  default     = ""
  sensitive   = true
}

variable "wallet_password" {
  type        = string
  description = "Wallet password (auto-generated if empty)"
  default     = ""
  sensitive   = true
}

variable "cpu_core_count" {
  type        = number
  description = "CPU core count (1 for free tier, 2+ for paid)"
  default     = 1
}

variable "data_storage_size_in_tbs" {
  type        = number
  description = "Data storage size in TBs (1 for free tier)"
  default     = 1
}

variable "is_free_tier" {
  type        = bool
  description = "Use Always Free tier"
  default     = true
}

variable "is_auto_scaling_enabled" {
  type        = bool
  description = "Enable auto-scaling"
  default     = true
}

variable "whitelisted_ips" {
  type        = list(string)
  description = "Whitelisted IPs for database access"
  default     = []
}

variable "private_endpoint_ip" {
  type        = string
  description = "Private endpoint IP for database (optional, auto-assigned if not specified)"
  default     = ""
}

variable "vault_id" {
  type        = string
  description = "OCI Vault OCID for storing secrets"
}

variable "vault_key_id" {
  type        = string
  description = "OCI KMS key OCID used to encrypt vault secrets"
}

variable "tags" {
  type        = map(string)
  description = "Additional tags"
  default     = {}
}