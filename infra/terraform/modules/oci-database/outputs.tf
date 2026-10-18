output "autonomous_database_id" {
  description = "OCID of the Autonomous Database"
  value       = oci_database_autonomous_database.main.id
}

output "database_connection_string" {
  description = "Database connection string"
  value       = "postgresql://${var.db_user}:${var.db_password != "" ? var.db_password : random_password.db_password.result}@${oci_database_autonomous_database.main.private_endpoint_ip}:1521/${var.db_name}"
  sensitive   = true
}

output "wallet_base64" {
  description = "Base64 encoded wallet"
  value       = oci_database_autonomous_database_wallet.wallet.content
  sensitive   = true
}

output "db_password_secret_id" {
  description = "OCID of the database password secret"
  value       = oci_vault_secret.db_password.id
}

output "db_connection_secret_id" {
  description = "OCID of the database connection string secret"
  value       = oci_vault_secret.db_connection_string.id
}

output "private_endpoint_ip" {
  description = "Private endpoint IP of the database"
  value       = oci_database_autonomous_database.main.private_endpoint_ip
}

output "db_name" {
  description = "Database name"
  value       = var.db_name
}