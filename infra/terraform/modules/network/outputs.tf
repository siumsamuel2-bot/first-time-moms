output "vcn_ocid" {
  description = "VCN OCID"
  value       = oci_core_vcn.main.id
}

output "public_subnet_ocid" {
  description = "Public subnet OCID"
  value       = oci_core_subnet.public.id
}

output "internet_gateway_ocid" {
  description = "Internet gateway OCID"
  value       = oci_core_internet_gateway.igw.id
}
