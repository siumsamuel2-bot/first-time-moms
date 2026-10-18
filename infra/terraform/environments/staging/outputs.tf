output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.loadbalancer.alb_dns_name
}

output "database_endpoint" {
  description = "RDS endpoint"
  value       = module.database.db_endpoint
  sensitive   = true
}

output "analytics_bucket_arn" {
  description = "Analytics bucket ARN"
  value       = module.storage.analytics_bucket_arn
}

output "github_actions_role_arn" {
  description = "GitHub Actions role ARN for OIDC"
  value       = module.security.github_actions_role_arn
}

output "kms_key_arn" {
  description = "KMS key ARN"
  value       = module.security.kms_key_arn
}