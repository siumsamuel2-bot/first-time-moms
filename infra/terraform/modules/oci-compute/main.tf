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

data "oci_core_images" "canonical_ubuntu" {
  compartment_id           = var.compartment_id
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.A1.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_instance" "api" {
  count = var.api_desired_count

  compartment_id = var.compartment_id
  display_name   = "${var.environment}-api-${count.index + 1}"
  shape          = "VM.Standard.A1.Flex"
  shape_config {
    ocpus         = var.api_ocpus
    memory_in_gbs = var.api_memory_gbs
  }

  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[count.index % length(data.oci_identity_availability_domains.ads.availability_domains)].name

  create_vnic_details {
    subnet_id              = var.api_subnet_id
    assign_public_ip       = var.api_assign_public_ip
    display_name           = "${var.environment}-api-vnic-${count.index + 1}"
    nsg_ids                = var.api_nsg_ids
    skip_source_dest_check = true
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.canonical_ubuntu.images[0].id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/cloud-init/api.yaml", {
      environment            = var.environment
      database_url           = var.database_url
      jwt_secret             = var.jwt_secret
      cors_origin            = var.cors_origin
      push_vapid_public_key  = var.push_vapid_public_key
      push_vapid_private_key = var.push_vapid_private_key
      push_vapid_subject     = var.push_vapid_subject
      port                   = var.api_port
      node_env               = "production"
      api_image              = var.api_image
      analytics_salt         = var.analytics_salt
    }))
  }

  freeform_tags = merge(local.tags, { Role = "api", Name = "${var.environment}-api-${count.index + 1}" })

  depends_on = [oci_core_network_security_group.api]
}

resource "oci_core_instance" "web" {
  count = var.web_desired_count

  compartment_id = var.compartment_id
  display_name   = "${var.environment}-web-${count.index + 1}"
  shape          = "VM.Standard.A1.Flex"
  shape_config {
    ocpus         = var.web_ocpus
    memory_in_gbs = var.web_memory_gbs
  }

  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[count.index % length(data.oci_identity_availability_domains.ads.availability_domains)].name

  create_vnic_details {
    subnet_id              = var.web_subnet_id
    assign_public_ip       = var.web_assign_public_ip
    display_name           = "${var.environment}-web-vnic-${count.index + 1}"
    nsg_ids                = var.web_nsg_ids
    skip_source_dest_check = true
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.canonical_ubuntu.images[0].id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/cloud-init/web.yaml", {
      environment = var.environment
      api_url     = var.api_url
      port        = var.web_port
      node_env    = "production"
      web_image   = var.web_image
    }))
  }

  freeform_tags = merge(local.tags, { Role = "web", Name = "${var.environment}-web-${count.index + 1}" })

  depends_on = [oci_core_network_security_group.web]
}

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_id
}

resource "oci_core_network_security_group" "api" {
  compartment_id = var.compartment_id
  vcn_id         = var.vcn_id
  display_name   = "${var.environment}-api-nsg"

  freeform_tags = local.tags
}

resource "oci_core_network_security_group_security_rule" "api_ingress_lb" {
  network_security_group_id = oci_core_network_security_group.api.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = var.load_balancer_cidr
  source_type               = "CIDR_BLOCK"
  stateless                 = false
  description               = "Allow traffic from load balancer to API"

  tcp_options {
    destination_port_range {
      min = var.api_port
      max = var.api_port
    }
  }
}

resource "oci_core_network_security_group_security_rule" "api_egress_all" {
  network_security_group_id = oci_core_network_security_group.api.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  stateless                 = false
  description               = "Allow all outbound"
}

resource "oci_core_network_security_group" "web" {
  compartment_id = var.compartment_id
  vcn_id         = var.vcn_id
  display_name   = "${var.environment}-web-nsg"

  freeform_tags = local.tags
}

resource "oci_core_network_security_group_security_rule" "web_ingress_lb" {
  network_security_group_id = oci_core_network_security_group.web.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = var.load_balancer_cidr
  source_type               = "CIDR_BLOCK"
  stateless                 = false
  description               = "Allow traffic from load balancer to Web"

  tcp_options {
    destination_port_range {
      min = var.web_port
      max = var.web_port
    }
  }
}

resource "oci_core_network_security_group_security_rule" "web_egress_all" {
  network_security_group_id = oci_core_network_security_group.web.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  stateless                 = false
  description               = "Allow all outbound"
}

resource "oci_core_network_security_group" "database_client" {
  compartment_id = var.compartment_id
  vcn_id         = var.vcn_id
  display_name   = "${var.environment}-db-client-nsg"

  freeform_tags = local.tags
}

resource "oci_core_network_security_group_security_rule" "db_client_egress" {
  network_security_group_id = oci_core_network_security_group.database_client.id
  direction                 = "EGRESS"
  protocol                  = "6"
  destination               = var.database_cidr
  destination_type          = "CIDR_BLOCK"
  stateless                 = false
  description               = "Allow outbound to database"

  tcp_options {
    destination_port_range {
      min = 5432
      max = 5432
    }
  }
}

