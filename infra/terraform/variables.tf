variable "compartment_ocid" {
  description = "OCID of the compartment staging resources are created in"
  type        = string
}

variable "availability_domain" {
  description = "Availability domain for compute instances and load balancer"
  type        = string
}

variable "environment" {
  description = "Environment name used for resource naming and tags"
  type        = string
  default     = "staging"
}

variable "vcn_cidr" {
  description = "CIDR block for the VCN"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public application subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "app_instance_count" {
  description = "Number of application instances. Always Free allows 4 OCPUs / 24 GB total across A1.Flex instances"
  type        = number
  default     = 2
}

variable "app_instance_ocpu" {
  description = "OCPUs per application instance (A1.Flex, Ampere ARM)"
  type        = number
  default     = 2
}

variable "app_instance_memory_gb" {
  description = "Memory in GB per application instance (A1.Flex)"
  type        = number
  default     = 12
}

variable "boot_volume_size_gb" {
  description = "Boot volume size in GB per instance (Always Free: 200 GB total block storage)"
  type        = number
  default     = 50
}

variable "ssh_public_key" {
  description = "SSH public key for instance access"
  type        = string
}

variable "db_admin_password" {
  description = "ADMIN password for the Autonomous Database (12+ chars, mixed case, number, special char)"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Autonomous Database name (letters and numbers only, starts with a letter)"
  type        = string
  default     = "firstweeksdb"
}

variable "db_display_name" {
  description = "Autonomous Database display name"
  type        = string
  default     = "firstweeks-staging-db"
}

variable "asset_bucket_name" {
  description = "Object Storage bucket name for application assets"
  type        = string
  default     = "firstweeks-staging-assets"
}

variable "app_container_image" {
  description = "Container image for the application tier (placeholder until app image is published)"
  type        = string
  default     = "docker.io/library/nginx:alpine"
}

variable "app_port" {
  description = "Port the application listens on"
  type        = number
  default     = 8080
}
