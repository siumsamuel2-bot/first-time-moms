output "instance_ocids" {
  description = "OCIDs of the application instances"
  value       = oci_core_instance.app[*].id
}

output "instance_public_ips" {
  description = "Public IPs of the application instances"
  value       = oci_core_instance.app[*].public_ip
}

output "instance_private_ips" {
  description = "Private IPs of the application instances (used as LB backends)"
  value       = oci_core_instance.app[*].private_ip
}
