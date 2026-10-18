terraform {
  required_version = ">= 1.5"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }

  backend "oci" {
    bucket = "staging-firstweeks-terraform-state"
    key    = "terraform.tfstate"
    region = "us-phoenix-1"
  }
}

provider "oci" {
  region = var.region
}

locals {
  tags = {
    Environment = "staging"
    ManagedBy   = "terraform"
    Project     = "firstweeks"
  }
}

module "network" {
  source = "../../modules/oci-network"

  environment           = "staging"
  region                = var.region
  compartment_id        = var.compartment_id
  vcn_cidr              = "10.0.0.0/16"
  vcn_dns_label         = "firstweeksstg"
  public_subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs  = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  database_subnet_cidrs = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
  tags                  = local.tags
}

module "storage" {
  source = "../../modules/oci-storage"

  environment    = "staging"
  region         = var.region
  compartment_id = var.compartment_id
  namespace      = var.namespace
  tags           = local.tags
}

module "database" {
  source = "../../modules/oci-database"

  environment              = "staging"
  region                   = var.region
  compartment_id           = var.compartment_id
  database_subnet_id       = module.network.database_subnet_ids[0]
  database_nsg_ids         = [module.network.database_security_list_id]
  db_name                  = "firstweeks"
  db_user                  = "admin"
  cpu_core_count           = 1
  data_storage_size_in_tbs = 1
  is_free_tier             = true
  is_auto_scaling_enabled  = true
  vault_id                 = module.security.vault_id
  vault_key_id             = module.security.kms_key_id
  tags                     = local.tags
}

module "loadbalancer" {
  source = "../../modules/oci-loadbalancer"

  environment      = "staging"
  region           = var.region
  compartment_id   = var.compartment_id
  subnet_ids       = module.network.public_subnet_ids
  nsg_ids          = [module.network.public_security_list_id]
  api_private_ips  = module.compute.api_private_ips
  web_private_ips  = module.compute.web_private_ips
  certificate_name = var.certificate_name
  domain           = var.domain
  tags             = local.tags
}

module "security" {
  source = "../../modules/oci-security"

  environment            = "staging"
  region                 = var.region
  tenancy_id             = var.tenancy_id
  compartment_id         = var.compartment_id
  jwt_secret             = var.jwt_secret
  push_vapid_public_key  = var.push_vapid_public_key
  push_vapid_private_key = var.push_vapid_private_key
  analytics_salt         = var.analytics_salt
  tags                   = local.tags
}

module "compute" {
  source = "../../modules/oci-compute"

  environment            = "staging"
  region                 = var.region
  compartment_id         = var.compartment_id
  vcn_id                 = module.network.vcn_id
  api_subnet_id          = module.network.private_subnet_ids[0]
  web_subnet_id          = module.network.private_subnet_ids[1]
  api_nsg_ids            = [module.security.instance_principals_dynamic_group_id, module.network.private_security_list_id]
  web_nsg_ids            = [module.security.instance_principals_dynamic_group_id, module.network.private_security_list_id]
  api_desired_count      = 1
  web_desired_count      = 1
  api_ocpus              = 1
  api_memory_gbs         = 6
  web_ocpus              = 1
  web_memory_gbs         = 4
  api_port               = 8080
  web_port               = 80
  api_assign_public_ip   = false
  web_assign_public_ip   = false
  load_balancer_cidr     = "10.0.0.0/16"
  database_cidr          = "10.0.21.0/24"
  ssh_public_key         = var.ssh_public_key
  database_url           = module.database.database_connection_string
  jwt_secret             = var.jwt_secret
  cors_origin            = "https://${var.domain}"
  push_vapid_public_key  = var.push_vapid_public_key
  push_vapid_private_key = var.push_vapid_private_key
  push_vapid_subject     = var.push_vapid_subject
  api_image              = var.api_image
  web_image              = var.web_image
  api_url                = "https://${var.domain}/api"
  analytics_salt         = var.analytics_salt
  tags                   = local.tags
}

module "monitoring" {
  source = "../../modules/oci-monitoring"

  environment      = "staging"
  region           = var.region
  compartment_id   = var.compartment_id
  api_instance_ids = module.compute.api_instance_ids
  web_instance_ids = module.compute.web_instance_ids
  load_balancer_id = module.loadbalancer.load_balancer_id
  database_id      = module.database.autonomous_database_id
  alarm_email      = var.alarm_email
  tags             = local.tags
}

