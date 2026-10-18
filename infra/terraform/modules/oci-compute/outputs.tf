output "api_instance_ids" {
  description = "OCIDs of API instances"
  value       = oci_core_instance.api[*].id
}

output "web_instance_ids" {
  description = "OCIDs of Web instances"
  value       = oci_core_instance.web[*].id
}

output "api_private_ips" {
  description = "Private IPs of API instances"
  value       = oci_core_instance.api[*].private_ip
}

output "web_private_ips" {
  description = "Private IPs of Web instances"
  value       = oci_core_instance.web[*].private_ip
}

output "api_nsg_id" {
  description = "OCID of API network security group"
  value       = oci_core_network_security_group.api.id
}

output "web_nsg_id" {
  description = "OCID of Web network security group"
  value       = oci_core_network_security_group.web.id
}

output "database_client_nsg_id" {
  description = "OCID of database client network security group"
  value       = oci_core_network_security_group.database_client.id
}