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

variable "bucket_name" {
  description = "Object Storage bucket name"
  type        = string
}
