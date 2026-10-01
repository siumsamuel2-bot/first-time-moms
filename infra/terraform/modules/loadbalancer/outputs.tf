output "load_balancer_ocid" {
  description = "Load balancer OCID"
  value       = oci_load_balancer_load_balancer.main.id
}

output "load_balancer_ip" {
  description = "Public IP of the load balancer"
  value       = oci_load_balancer_load_balancer.main.ip_address_details[0].ip_address
}

output "backend_set_name" {
  description = "Backend set name"
  value       = oci_load_balancer_backend_set.app.name
}
