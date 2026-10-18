terraform {
  required_version = ">= 1.5"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "oci" {
  region = var.region
}

locals {
  tags = merge(
    {
      Environment = var.environment
      ManagedBy   = "terraform"
      Project     = "firstweeks"
    },
    var.tags
  )
}

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_id
}

resource "random_password" "db_password" {
  length           = 32
  special          = false
  override_special = "_%@"
}

resource "oci_database_autonomous_database" "main" {
  compartment_id              = var.compartment_id
  display_name                = "${var.environment}-firstweeks-db"
  db_name                     = var.db_name
  admin_password              = var.db_password != "" ? var.db_password : random_password.db_password.result
  cpu_core_count              = var.cpu_core_count
  data_storage_size_in_tbs    = var.data_storage_size_in_tbs
  is_free_tier                = var.is_free_tier
  license_model               = "LICENSE_INCLUDED"
  db_workload                 = "OLTP"
  is_auto_scaling_enabled     = var.is_auto_scaling_enabled
  whitelisted_ips             = var.whitelisted_ips
  is_mtls_connection_required = false
  private_endpoint_label      = "${var.environment}-firstweeks-db"
  private_endpoint_ip         = var.private_endpoint_ip
  subnet_id                   = var.database_subnet_id
  nsg_ids                     = var.database_nsg_ids

  freeform_tags = local.tags

  lifecycle {
    ignore_changes = [admin_password]
  }
}

resource "oci_database_autonomous_database_wallet" "wallet" {
  autonomous_database_id = oci_database_autonomous_database.main.id
  password               = var.wallet_password != "" ? var.wallet_password : random_password.db_password.result
  base64_encode_content  = true
}

resource "oci_vault_secret" "db_password" {
  compartment_id = var.compartment_id
  vault_id       = var.vault_id
  key_id         = var.vault_key_id
  secret_name    = "${var.environment}-firstweeks-db-password"
  description    = "Database password for ${var.environment} environment"
  secret_content {
    content_type = "BASE64"
    content      = base64encode(var.db_password != "" ? var.db_password : random_password.db_password.result)
  }
  freeform_tags = local.tags
}

resource "oci_vault_secret" "db_connection_string" {
  compartment_id = var.compartment_id
  vault_id       = var.vault_id
  key_id         = var.vault_key_id
  secret_name    = "${var.environment}-firstweeks-db-connection"
  description    = "Database connection string for ${var.environment} environment"
  secret_content {
    content_type = "BASE64"
    content      = base64encode("postgresql://${var.db_user}:${var.db_password != "" ? var.db_password : random_password.db_password.result}@${oci_database_autonomous_database.main.private_endpoint_ip}:1521/${var.db_name}")
  }
  freeform_tags = local.tags
}

