output "db_instance_id" {
  description = "RDS instance identifier"
  value       = aws_db_instance.main.id
}

output "db_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "db_port" {
  description = "RDS port"
  value       = aws_db_instance.main.port
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

output "db_username" {
  description = "Database username"
  value       = var.db_username
}

output "db_password" {
  description = "Database password"
  value       = var.db_password != "" ? var.db_password : random_password.db_password.result
  sensitive   = true
}

output "db_security_group_id" {
  description = "Database security group ID"
  value       = aws_security_group.database.id
}

output "database_url_secret_arn" {
  description = "Secrets Manager secret ARN for database URL"
  value       = aws_secretsmanager_secret.database_url.arn
}

output "kms_key_arn" {
  description = "KMS key ARN for RDS encryption"
  value       = aws_kms_key.rds.arn
}