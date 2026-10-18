terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    acme = {
      source  = "vancluever/acme"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    bucket         = "firstweeks-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Environment = "production"
      ManagedBy   = "terraform"
      Project     = "firstweeks"
    }
  }
}

provider "tls" {}

locals {
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
    Project     = "firstweeks"
  }
}

module "network" {
  source = "../../modules/network"

  environment           = "production"
  region                = var.region
  vpc_cidr              = "10.0.0.0/16"
  public_subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs  = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  database_subnet_cidrs = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
  enable_nat_gateway    = true
  tags                  = local.tags
}

module "storage" {
  source = "../../modules/storage"

  environment = "production"
  region      = var.region
  tags        = local.tags
}

module "database" {
  source = "../../modules/database"

  environment           = "production"
  region                = var.region
  vpc_id                = module.network.vpc_id
  database_subnet_ids   = module.network.database_subnet_ids
  ecs_security_group_id = module.loadbalancer.ecs_security_group_id
  db_name               = "firstweeks"
  db_username           = "postgres"
  instance_class        = "db.t3.medium"
  allocated_storage     = 100
  max_allocated_storage = 500
  backup_retention_days = 35
  multi_az              = true
  deletion_protection   = true
  tags                  = local.tags
}

module "loadbalancer" {
  source = "../../modules/loadbalancer"

  environment           = "production"
  region                = var.region
  vpc_id                = module.network.vpc_id
  public_subnet_ids     = module.network.public_subnet_ids
  certificate_arn       = var.certificate_arn
  access_logs_bucket_id = module.storage.alb_logs_bucket_id
  tags                  = local.tags
}

module "security" {
  source = "../../modules/security"

  environment            = "production"
  region                 = var.region
  github_repo            = var.github_repo
  ecs_cluster_name       = module.compute.ecs_cluster_name
  analytics_bucket_arn   = module.storage.analytics_bucket_arn
  jwt_secret             = var.jwt_secret
  push_vapid_public_key  = var.push_vapid_public_key
  push_vapid_private_key = var.push_vapid_private_key
  config_bucket_id       = module.storage.assets_bucket_id
  tags                   = local.tags
}

module "compute" {
  source = "../../modules/compute"

  environment           = "production"
  region                = var.region
  vpc_id                = module.network.vpc_id
  private_subnet_ids    = module.network.private_subnet_ids
  api_security_group_id = module.loadbalancer.ecs_security_group_id
  web_security_group_id = module.loadbalancer.ecs_security_group_id
  api_target_group_arn  = module.loadbalancer.api_target_group_arn
  web_target_group_arn  = module.loadbalancer.web_target_group_arn
  api_image             = var.api_image
  web_image             = var.web_image
  api_cpu               = 512
  api_memory            = 1024
  api_desired_count     = 2
  api_port              = 8080
  web_cpu               = 256
  web_memory            = 512
  web_desired_count     = 2
  web_port              = 80
  cors_origin           = "https://app.firstweeks.app"
  secrets_prefix        = "production"
  kms_key_arn           = module.security.kms_key_arn
  analytics_bucket_arn  = module.storage.analytics_bucket_arn
  tags                  = local.tags
}

module "monitoring" {
  source = "../../modules/monitoring"

  environment      = "production"
  region           = var.region
  ecs_cluster_name = module.compute.ecs_cluster_name
  alb_name         = "production-firstweeks-alb"
  db_instance_id   = module.database.db_instance_id
  alarm_email      = var.alarm_email
  tags             = local.tags
}

module "analytics_lambda" {
  source = "../../modules/analytics-lambda"

  environment             = "production"
  region                  = var.region
  vpc_id                  = module.network.vpc_id
  private_subnet_ids      = module.network.private_subnet_ids
  analytics_bucket_arn    = module.storage.analytics_bucket_arn
  analytics_bucket_name   = module.storage.analytics_bucket_id
  analytics_salt          = var.analytics_salt
  database_url_secret_arn = module.database.database_url_secret_arn
  kms_key_arn             = module.security.kms_key_arn
  lambda_source_path      = "../../../apps/api/dist"
  lambda_output_path      = "../../../apps/api/dist/analytics-lambda.zip"
  tags                    = local.tags
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.loadbalancer.alb_dns_name
}

output "api_image" {
  description = "API Docker image"
  value       = var.api_image
}

output "web_image" {
  description = "Web Docker image"
  value       = var.web_image
}

output "database_endpoint" {
  description = "RDS endpoint"
  value       = module.database.db_endpoint
  sensitive   = true
}

output "analytics_bucket_arn" {
  description = "Analytics bucket ARN"
  value       = module.storage.analytics_bucket_arn
}

output "github_actions_role_arn" {
  description = "GitHub Actions role ARN for OIDC"
  value       = module.security.github_actions_role_arn
}