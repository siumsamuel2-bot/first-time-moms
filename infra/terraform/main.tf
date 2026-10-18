locals {
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = "firstweeks"
  }
}

# Availability domains for the homed region (reference for tfvars)
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_ocid
}

module "network" {
  source = "./modules/network"

  compartment_ocid   = var.compartment_ocid
  vcn_cidr           = var.vcn_cidr
  public_subnet_cidr = var.public_subnet_cidr
  environment        = var.environment
  tags               = local.tags
}

module "compute" {
  source = "./modules/compute"

  compartment_ocid    = var.compartment_ocid
  availability_domain = var.availability_domain
  subnet_ocid         = module.network.public_subnet_ocid
  environment         = var.environment
  tags                = local.tags
  instance_count      = var.app_instance_count
  instance_ocpu       = var.app_instance_ocpu
  instance_memory_gb  = var.app_instance_memory_gb
  boot_volume_size_gb = var.boot_volume_size_gb
  ssh_public_key      = var.ssh_public_key
  app_container_image = var.app_container_image
  app_port            = var.app_port
}

module "database" {
  source = "./modules/database"

  compartment_ocid  = var.compartment_ocid
  environment       = var.environment
  tags              = local.tags
  db_admin_password = var.db_admin_password
  db_name           = var.db_name
  db_display_name   = var.db_display_name
}

module "loadbalancer" {
  source = "./modules/loadbalancer"

  compartment_ocid       = var.compartment_ocid
  availability_domain    = var.availability_domain
  subnet_ocid            = module.network.public_subnet_ocid
  environment            = var.environment
  tags                   = local.tags
  backend_instance_ocids = module.compute.instance_ocids
  backend_instance_ips   = module.compute.instance_private_ips
  backend_port           = var.app_port
}

module "storage" {
  source = "./modules/storage"

  compartment_ocid = var.compartment_ocid
  environment      = var.environment
  tags             = local.tags
  bucket_name      = var.asset_bucket_name
}
