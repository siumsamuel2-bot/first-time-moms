# OCI Terraform Backend Configuration
# This file is used with: terraform init -backend-config=backend.hcl

bucket = "staging-firstweeks-terraform-state"
key    = "terraform.tfstate"
region = "us-phoenix-1"