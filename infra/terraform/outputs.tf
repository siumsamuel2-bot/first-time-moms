output "load_balancer_ip" {
  description = "Public IP of the staging load balancer (point DNS here)"
  value       = module.loadbalancer.load_balancer_ip
}

output "app_instance_public_ips" {
  description = "Public IPs of staging application instances"
  value       = module.compute.instance_public_ips
}

output "autonomous_database_ocid" {
  description = "Autonomous Database OCID"
  value       = module.database.autonomous_database_ocid
}

output "asset_bucket" {
  description = "Object Storage bucket for application assets"
  value       = module.storage.bucket_name
}

output "object_storage_namespace" {
  description = "Object Storage namespace"
  value       = module.storage.namespace
}
