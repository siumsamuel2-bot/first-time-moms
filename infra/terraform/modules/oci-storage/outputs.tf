output "analytics_bucket_name" {
  description = "Analytics bucket name"
  value       = oci_objectstorage_bucket.analytics.name
}

output "analytics_bucket_namespace" {
  description = "Analytics bucket namespace"
  value       = oci_objectstorage_bucket.analytics.namespace
}

output "assets_bucket_name" {
  description = "Assets bucket name"
  value       = oci_objectstorage_bucket.assets.name
}

output "assets_bucket_namespace" {
  description = "Assets bucket namespace"
  value       = oci_objectstorage_bucket.assets.namespace
}

output "terraform_state_bucket_name" {
  description = "Terraform state bucket name"
  value       = oci_objectstorage_bucket.terraform_state.name
}

output "terraform_state_bucket_namespace" {
  description = "Terraform state bucket namespace"
  value       = oci_objectstorage_bucket.terraform_state.namespace
}

output "alb_logs_bucket_name" {
  description = "ALB logs bucket name"
  value       = oci_objectstorage_bucket.alb_logs.name
}

output "alb_logs_bucket_namespace" {
  description = "ALB logs bucket namespace"
  value       = oci_objectstorage_bucket.alb_logs.namespace
}

output "backups_bucket_name" {
  description = "Backups bucket name"
  value       = oci_objectstorage_bucket.backups.name
}

output "backups_bucket_namespace" {
  description = "Backups bucket namespace"
  value       = oci_objectstorage_bucket.backups.namespace
}