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

variable "vcn_id" {
  type        = string
  description = "VCN OCID"
}

variable "api_subnet_id" {
  type        = string
  description = "Subnet OCID for API instances"
}

variable "web_subnet_id" {
  type        = string
  description = "Subnet OCID for Web instances"
}

variable "api_nsg_ids" {
  type        = list(string)
  description = "NSG OCIDs for API instances"
  default     = []
}

variable "web_nsg_ids" {
  type        = list(string)
  description = "NSG OCIDs for Web instances"
  default     = []
}

variable "api_desired_count" {
  type        = number
  description = "Number of API instances"
  default     = 1
}

variable "web_desired_count" {
  type        = number
  description = "Number of Web instances"
  default     = 1
}

variable "api_ocpus" {
  type        = number
  description = "OCPUs for API instances (A1.Flex: 1-4)"
  default     = 1
}

variable "api_memory_gbs" {
  type        = number
  description = "Memory in GBs for API instances (A1.Flex: 1-64)"
  default     = 6
}

variable "web_ocpus" {
  type        = number
  description = "OCPUs for Web instances (A1.Flex: 1-4)"
  default     = 1
}

variable "web_memory_gbs" {
  type        = number
  description = "Memory in GBs for Web instances (A1.Flex: 1-64)"
  default     = 4
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

variable "api_assign_public_ip" {
  type        = bool
  description = "Assign public IP to API instances"
  default     = false
}

variable "web_assign_public_ip" {
  type        = bool
  description = "Assign public IP to Web instances"
  default     = false
}

variable "load_balancer_cidr" {
  type        = string
  description = "CIDR block for load balancer subnet"
  default     = "10.0.0.0/16"
}

variable "database_cidr" {
  type        = string
  description = "CIDR block for database subnet"
  default     = "10.0.21.0/24"
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key for instance access"
}

variable "database_url" {
  type        = string
  description = "PostgreSQL connection string"
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  description = "JWT secret key"
  sensitive   = true
}

variable "cors_origin" {
  type        = string
  description = "CORS origin for API"
  default     = "https://app.firstweeks.app"
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

variable "api_image" {
  type        = string
  description = "Docker image for API"
}

variable "web_image" {
  type        = string
  description = "Docker image for Web"
}

variable "api_url" {
  type        = string
  description = "API URL for Web frontend"
}

variable "analytics_salt" {
  type        = string
  description = "Salt for analytics de-identification"
  sensitive   = true
}

variable "tags" {
  type        = map(string)
  description = "Additional tags"
  default     = {}
}