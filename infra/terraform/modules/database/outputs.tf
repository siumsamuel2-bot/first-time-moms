output "autonomous_database_ocid" {
  description = "Autonomous Database OCID"
  value       = oci_database_autonomous_database.main.id
}

output "connection_strings" {
  description = "Connection strings for the Autonomous Database"
  value       = oci_database_autonomous_database.main.connection_strings
}
