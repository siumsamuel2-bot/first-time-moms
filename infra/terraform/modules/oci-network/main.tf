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

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_id
}

resource "oci_core_vcn" "main" {
  cidr_block     = var.vcn_cidr
  compartment_id = var.compartment_id
  display_name   = "${var.environment}-vcn"
  dns_label      = var.vcn_dns_label

  freeform_tags = local.tags
}

resource "oci_core_internet_gateway" "main" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-igw"
  enabled        = true

  freeform_tags = local.tags
}

resource "oci_core_nat_gateway" "main" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-nat"
  block_traffic  = false

  freeform_tags = local.tags
}

data "oci_core_services" "all" {}

resource "oci_core_service_gateway" "main" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-sgw"

  services {
    service_id = data.oci_core_services.all.services[0].id
  }

  freeform_tags = local.tags
}

resource "oci_core_subnet" "public" {
  count                      = length(var.public_subnet_cidrs)
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.main.id
  cidr_block                 = var.public_subnet_cidrs[count.index]
  availability_domain        = data.oci_identity_availability_domains.ads.availability_domains[count.index % length(data.oci_identity_availability_domains.ads.availability_domains)].name
  display_name               = "${var.environment}-public-subnet-${count.index + 1}"
  dns_label                  = "${var.vcn_dns_label}-pub${count.index + 1}"
  prohibit_public_ip_on_vnic = false
  route_table_id             = oci_core_route_table.public.id
  security_list_ids          = [oci_core_security_list.public.id]

  freeform_tags = merge(local.tags, { Type = "public" })
}

resource "oci_core_subnet" "private" {
  count                      = length(var.private_subnet_cidrs)
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.main.id
  cidr_block                 = var.private_subnet_cidrs[count.index]
  availability_domain        = data.oci_identity_availability_domains.ads.availability_domains[count.index % length(data.oci_identity_availability_domains.ads.availability_domains)].name
  display_name               = "${var.environment}-private-subnet-${count.index + 1}"
  dns_label                  = "${var.vcn_dns_label}-priv${count.index + 1}"
  prohibit_public_ip_on_vnic = true
  route_table_id             = oci_core_route_table.private.id
  security_list_ids          = [oci_core_security_list.private.id]

  freeform_tags = merge(local.tags, { Type = "private" })
}

resource "oci_core_subnet" "database" {
  count                      = length(var.database_subnet_cidrs)
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.main.id
  cidr_block                 = var.database_subnet_cidrs[count.index]
  availability_domain        = data.oci_identity_availability_domains.ads.availability_domains[count.index % length(data.oci_identity_availability_domains.ads.availability_domains)].name
  display_name               = "${var.environment}-db-subnet-${count.index + 1}"
  dns_label                  = "${var.vcn_dns_label}-db${count.index + 1}"
  prohibit_public_ip_on_vnic = true
  route_table_id             = oci_core_route_table.private.id
  security_list_ids          = [oci_core_security_list.database.id]

  freeform_tags = merge(local.tags, { Type = "database" })
}

resource "oci_core_route_table" "public" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-public-rt"

  route_rules {
    network_entity_id = oci_core_internet_gateway.main.id
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
  }

  freeform_tags = local.tags
}

resource "oci_core_route_table" "private" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-private-rt"

  route_rules {
    network_entity_id = oci_core_nat_gateway.main.id
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
  }

  route_rules {
    network_entity_id = oci_core_service_gateway.main.id
    destination       = "oci-phx-objectstorage"
    destination_type  = "SERVICE_CIDR_BLOCK"
  }

  freeform_tags = local.tags
}

resource "oci_core_security_list" "public" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-public-sl"

  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    stateless = false
    tcp_options {
      min = 80
      max = 80
    }
  }

  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    stateless = false
    tcp_options {
      min = 443
      max = 443
    }
  }

  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    stateless = false
    tcp_options {
      min = 8080
      max = 8080
    }
  }

  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
    stateless   = false
  }

  freeform_tags = local.tags
}

resource "oci_core_security_list" "private" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-private-sl"

  ingress_security_rules {
    protocol  = "6"
    source    = var.vcn_cidr
    stateless = false
    tcp_options {
      min = 8080
      max = 8080
    }
  }

  ingress_security_rules {
    protocol  = "6"
    source    = var.vcn_cidr
    stateless = false
    tcp_options {
      min = 5432
      max = 5432
    }
  }

  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
    stateless   = false
  }

  freeform_tags = local.tags
}

resource "oci_core_security_list" "database" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.environment}-db-sl"

  ingress_security_rules {
    protocol  = "6"
    source    = var.vcn_cidr
    stateless = false
    tcp_options {
      min = 5432
      max = 5432
    }
  }

  ingress_security_rules {
    protocol  = "6"
    source    = var.vcn_cidr
    stateless = false
    tcp_options {
      min = 8080
      max = 8080
    }
  }

  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
    stateless   = false
  }

  freeform_tags = local.tags
}
