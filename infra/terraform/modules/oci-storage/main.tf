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

resource "oci_objectstorage_bucket" "analytics" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-firstweeks-analytics"
  namespace      = var.namespace
  storage_tier   = "Standard"
  versioning     = "Enabled"
  access_type    = "NoPublicAccess"

  freeform_tags = local.tags
}

resource "oci_objectstorage_bucket" "assets" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-firstweeks-assets"
  namespace      = var.namespace
  storage_tier   = "Standard"
  versioning     = "Enabled"
  access_type    = "ObjectRead"

  freeform_tags = local.tags
}

resource "oci_objectstorage_bucket" "terraform_state" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-firstweeks-terraform-state"
  namespace      = var.namespace
  storage_tier   = "Standard"
  versioning     = "Enabled"
  access_type    = "NoPublicAccess"

  freeform_tags = local.tags
}

resource "oci_objectstorage_bucket" "alb_logs" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-firstweeks-alb-logs"
  namespace      = var.namespace
  storage_tier   = "Standard"
  versioning     = "Enabled"
  access_type    = "NoPublicAccess"

  freeform_tags = local.tags
}

resource "oci_objectstorage_bucket" "backups" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-firstweeks-backups"
  namespace      = var.namespace
  storage_tier   = "Archive"
  versioning     = "Enabled"
  access_type    = "NoPublicAccess"

  freeform_tags = local.tags
}

