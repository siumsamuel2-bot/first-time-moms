terraform {
  required_version = ">= 1.5"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
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

data "oci_identity_compartment" "root" {
  id = var.tenancy_id
}

resource "oci_identity_group" "github_actions" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-github-actions"
  description    = "Group for GitHub Actions OIDC federation"
}

resource "oci_identity_policy" "github_actions" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-github-actions-policy"
  description    = "Policy for GitHub Actions to manage resources"
  statements = [
    "Allow group ${var.environment}-github-actions to manage all-resources in compartment ${var.compartment_id}",
    "Allow group ${var.environment}-github-actions to read all-resources in tenancy",
  ]
}

resource "oci_identity_policy" "instance_principals" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-instance-principals-policy"
  description    = "Policy for instance principals to access secrets and object storage"
  statements = [
    "Allow dynamic-group ${var.environment}-instance-principals to read secret-bundles in compartment ${var.compartment_id}",
    "Allow dynamic-group ${var.environment}-instance-principals to manage objects in compartment ${var.compartment_id}",
    "Allow dynamic-group ${var.environment}-instance-principals to read buckets in compartment ${var.compartment_id}",
  ]
}

resource "oci_identity_dynamic_group" "instance_principals" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-instance-principals"
  description    = "Dynamic group for compute instances"
  matching_rule  = "ALL {instance.compartment.id = '${var.compartment_id}', instance.id != ''}"
}

resource "oci_kms_key" "main" {
  compartment_id      = var.compartment_id
  display_name        = "${var.environment}-firstweeks-kms"
  management_endpoint = oci_kms_vault.main.management_endpoint
  key_shape {
    algorithm = "AES"
    length    = 256
  }
  protection_mode = "SOFTWARE"
  freeform_tags   = local.tags
}

resource "oci_kms_vault" "main" {
  compartment_id = var.compartment_id
  display_name   = "${var.environment}-firstweeks-vault"
  vault_type     = "DEFAULT"
  freeform_tags  = local.tags
}

resource "oci_vault_secret" "jwt_secret" {
  compartment_id = var.compartment_id
  vault_id       = oci_kms_vault.main.id
  key_id         = oci_kms_key.main.id
  secret_name    = "${var.environment}-firstweeks-jwt-secret"
  description    = "JWT secret for ${var.environment} environment"
  secret_content {
    content_type = "BASE64"
    content      = base64encode(var.jwt_secret)
  }
  freeform_tags = local.tags
}

resource "oci_vault_secret" "push_vapid_public_key" {
  compartment_id = var.compartment_id
  vault_id       = oci_kms_vault.main.id
  key_id         = oci_kms_key.main.id
  secret_name    = "${var.environment}-firstweeks-push-vapid-public"
  description    = "VAPID public key for push notifications"
  secret_content {
    content_type = "BASE64"
    content      = base64encode(var.push_vapid_public_key)
  }
  freeform_tags = local.tags
}

resource "oci_vault_secret" "push_vapid_private_key" {
  compartment_id = var.compartment_id
  vault_id       = oci_kms_vault.main.id
  key_id         = oci_kms_key.main.id
  secret_name    = "${var.environment}-firstweeks-push-vapid-private"
  description    = "VAPID private key for push notifications"
  secret_content {
    content_type = "BASE64"
    content      = base64encode(var.push_vapid_private_key)
  }
  freeform_tags = local.tags
}

resource "oci_vault_secret" "analytics_salt" {
  compartment_id = var.compartment_id
  vault_id       = oci_kms_vault.main.id
  key_id         = oci_kms_key.main.id
  secret_name    = "${var.environment}-firstweeks-analytics-salt"
  description    = "Analytics de-identification salt"
  secret_content {
    content_type = "BASE64"
    content      = base64encode(var.analytics_salt)
  }
  freeform_tags = local.tags
}

