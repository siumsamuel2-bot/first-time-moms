output "vcn_id" {
  description = "OCID of the VCN"
  value       = oci_core_vcn.main.id
}

output "public_subnet_ids" {
  description = "OCIDs of public subnets"
  value       = oci_core_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "OCIDs of private subnets"
  value       = oci_core_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "OCIDs of database subnets"
  value       = oci_core_subnet.database[*].id
}

output "internet_gateway_id" {
  description = "OCID of the internet gateway"
  value       = oci_core_internet_gateway.main.id
}

output "nat_gateway_id" {
  description = "OCID of the NAT gateway"
  value       = oci_core_nat_gateway.main.id
}

output "service_gateway_id" {
  description = "OCID of the service gateway"
  value       = oci_core_service_gateway.main.id
}

output "public_security_list_id" {
  description = "OCID of the public security list"
  value       = oci_core_security_list.public.id
}

output "private_security_list_id" {
  description = "OCID of the private security list"
  value       = oci_core_security_list.private.id
}

output "database_security_list_id" {
  description = "OCID of the database security list"
  value       = oci_core_security_list.database.id
}

output "public_route_table_id" {
  description = "OCID of the public route table"
  value       = oci_core_route_table.public.id
}

output "private_route_table_id" {
  description = "OCID of the private route table"
  value       = oci_core_route_table.private.id
}