variable "compartment_ocid" {
  description = "Compartment OCID"
  type        = string
}

variable "availability_domain" {
  description = "Availability domain for the instances"
  type        = string
}

variable "subnet_ocid" {
  description = "Subnet OCID for instance VNICs"
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

variable "instance_count" {
  description = "Number of application instances (Always Free: 4 OCPUs / 24 GB total)"
  type        = number
}

variable "instance_ocpu" {
  description = "OCPUs per instance"
  type        = number
}

variable "instance_memory_gb" {
  description = "Memory GB per instance"
  type        = number
}

variable "boot_volume_size_gb" {
  description = "Boot volume size GB per instance"
  type        = number
}

variable "ssh_public_key" {
  description = "SSH public key"
  type        = string
}

variable "app_container_image" {
  description = "Container image for the app tier"
  type        = string
}

variable "app_port" {
  description = "Application listen port"
  type        = number
}
