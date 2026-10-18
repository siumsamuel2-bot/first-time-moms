output "load_balancer_id" {
  description = "OCID of the load balancer"
  value       = oci_load_balancer_load_balancer.main.id
}

output "load_balancer_ip" {
  description = "Public IP address of the load balancer"
  value       = oci_load_balancer_load_balancer.main.ip_address_details[0].ip_address
}

output "load_balancer_hostname" {
  description = "DNS/display hostname of the load balancer"
  value       = oci_load_balancer_load_balancer.main.display_name
}

output "api_backend_set_name" {
  description = "Name of the API backend set"
  value       = oci_load_balancer_backend_set.api.name
}

output "web_backend_set_name" {
  description = "Name of the Web backend set"
  value       = oci_load_balancer_backend_set.web.name
}