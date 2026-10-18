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

resource "oci_load_balancer_load_balancer" "main" {
  compartment_id = var.compartment_id
  display_name   = "${var.environment}-firstweeks-lb"
  shape          = "flexible"
  shape_details {
    minimum_bandwidth_in_mbps = var.min_bandwidth_mbps
    maximum_bandwidth_in_mbps = var.max_bandwidth_mbps
  }
  subnet_ids                 = var.subnet_ids
  network_security_group_ids = var.nsg_ids
  is_private                 = var.is_private

  freeform_tags = local.tags
}

resource "oci_load_balancer_backend_set" "api" {
  load_balancer_id = oci_load_balancer_load_balancer.main.id
  name             = "api-backend"
  policy           = "ROUND_ROBIN"

  health_checker {
    protocol          = "HTTP"
    url_path          = "/healthz"
    port              = var.api_port
    interval_ms       = 30000
    timeout_in_millis = 5000
    retries           = 3
    return_code       = 200
  }
}

resource "oci_load_balancer_backend_set" "web" {
  load_balancer_id = oci_load_balancer_load_balancer.main.id
  name             = "web-backend"
  policy           = "ROUND_ROBIN"

  health_checker {
    protocol          = "HTTP"
    url_path          = "/health"
    port              = var.web_port
    interval_ms       = 30000
    timeout_in_millis = 5000
    retries           = 3
    return_code       = 200
  }
}

resource "oci_load_balancer_listener" "api_https" {
  load_balancer_id         = oci_load_balancer_load_balancer.main.id
  name                     = "api-https"
  default_backend_set_name = "api-backend"
  port                     = 443
  protocol                 = "HTTPS"
  ssl_configuration {
    certificate_name = var.certificate_name
  }
}

resource "oci_load_balancer_listener" "web_https" {
  load_balancer_id         = oci_load_balancer_load_balancer.main.id
  name                     = "web-https"
  default_backend_set_name = "web-backend"
  port                     = 443
  protocol                 = "HTTPS"
  ssl_configuration {
    certificate_name = var.certificate_name
  }
}

resource "oci_load_balancer_listener" "api_http" {
  load_balancer_id         = oci_load_balancer_load_balancer.main.id
  name                     = "api-http"
  default_backend_set_name = "api-backend"
  port                     = 80
  protocol                 = "HTTP"
}

resource "oci_load_balancer_listener" "web_http" {
  load_balancer_id         = oci_load_balancer_load_balancer.main.id
  name                     = "web-http"
  default_backend_set_name = "web-backend"
  port                     = 80
  protocol                 = "HTTP"
}

resource "oci_load_balancer_rule_set" "https_redirect" {
  load_balancer_id = oci_load_balancer_load_balancer.main.id
  name             = "https-redirect"

  items {
    action = "REDIRECT"
    conditions {
      attribute_name  = "http-header"
      attribute_value = "host"
      operator        = "ENDS_WITH"
    }
    redirect_uri {
      protocol = "https"
      host     = var.domain
      path     = "{path}"
      query    = "{query}"
    }
    response_code = 301
  }
}

resource "oci_load_balancer_backend" "api" {
  count            = length(var.api_private_ips)
  load_balancer_id = oci_load_balancer_load_balancer.main.id
  backendset_name  = oci_load_balancer_backend_set.api.name
  ip_address       = var.api_private_ips[count.index]
  port             = var.api_port
  weight           = 1
}

resource "oci_load_balancer_backend" "web" {
  count            = length(var.web_private_ips)
  load_balancer_id = oci_load_balancer_load_balancer.main.id
  backendset_name  = oci_load_balancer_backend_set.web.name
  ip_address       = var.web_private_ips[count.index]
  port             = var.web_port
  weight           = 1
}

