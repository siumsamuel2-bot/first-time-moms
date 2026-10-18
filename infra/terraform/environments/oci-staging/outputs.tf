output "load_balancer_ip" {
  description = "Load balancer public IP"
  value       = module.loadbalancer.load_balancer_ip
}

output "load_balancer_hostname" {
  description = "Load balancer hostname"
  value       = module.loadbalancer.load_balancer_hostname
}

output "api_image" {
  description = "API Docker image"
  value       = var.api_image
}

output "web_image" {
  description = "Web Docker image"
  value       = var.web_image
}

output "database_connection_string" {
  description = "Database connection string"
  value       = module.database.database_connection_string
  sensitive   = true
}

output "vault_id" {
  description = "OCI Vault OCID"
  value       = module.security.vault_id
}

output "github_actions_group_id" {
  description = "GitHub Actions group OCID"
  value       = module.security.github_actions_group_id
}

output "vcn_id" {
  description = "VCN OCID"
  value       = module.network.vcn_id
}

output "private_subnet_ids" {
  description = "Private subnet OCIDs"
  value       = module.network.private_subnet_ids
}

output "public_subnet_ids" {
  description = "Public subnet OCIDs"
  value       = module.network.public_subnet_ids
}

output "database_subnet_ids" {
  description = "Database subnet OCIDs"
  value       = module.network.database_subnet_ids
}

output "analytics_bucket_name" {
  description = "Analytics bucket name"
  value       = module.storage.analytics_bucket_name
}

output "analytics_bucket_namespace" {
  description = "Analytics bucket namespace"
  value       = module.storage.analytics_bucket_namespace
}

output "terraform_state_bucket_name" {
  description = "Terraform state bucket name"
  value       = module.storage.terraform_state_bucket_name
}

output "alb_logs_bucket_name" {
  description = "ALB logs bucket name"
  value       = module.storage.alb_logs_bucket_name
}