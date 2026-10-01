variable "compartment_ocid" {
  description = "Compartment OCID"
  type        = string
}

variable "availability_domain" {
  description = "Availability domain for the load balancer"
  type        = string
}

variable "subnet_ocid" {
  description = "Subnet OCID for the load balancer"
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

variable "backend_instance_ocids" {
  description = "OCIDs of backend application instances"
  type        = list(string)
}

variable "backend_instance_ips" {
  description = "Private IPs of backend application instances"
  type        = list(string)
}

variable "backend_port" {
  description = "Port backend instances listen on"
  type        = number
}
