output "kms_key_id" {
  description = "OCID of the KMS key"
  value       = oci_kms_key.main.id
}

output "vault_id" {
  description = "OCID of the Vault"
  value       = oci_kms_vault.main.id
}

output "github_actions_group_id" {
  description = "OCID of the GitHub Actions group"
  value       = oci_identity_group.github_actions.id
}

output "instance_principals_dynamic_group_id" {
  description = "OCID of the instance principals dynamic group"
  value       = oci_identity_dynamic_group.instance_principals.id
}

output "jwt_secret_id" {
  description = "OCID of the JWT secret"
  value       = oci_vault_secret.jwt_secret.id
}

output "push_vapid_public_key_id" {
  description = "OCID of the VAPID public key secret"
  value       = oci_vault_secret.push_vapid_public_key.id
}

output "push_vapid_private_key_id" {
  description = "OCID of the VAPID private key secret"
  value       = oci_vault_secret.push_vapid_private_key.id
}

output "analytics_salt_id" {
  description = "OCID of the analytics salt secret"
  value       = oci_vault_secret.analytics_salt.id
}