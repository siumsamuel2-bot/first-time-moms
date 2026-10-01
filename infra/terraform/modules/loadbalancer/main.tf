resource "oci_load_balancer_load_balancer" "main" {
  compartment_id = var.compartment_ocid
  display_name   = "${var.environment}-lb"
  shape          = "flexible"
  subnet_ids     = [var.subnet_ocid]

  shape_details {
    minimum_bandwidth_in_mbps = 10
    maximum_bandwidth_in_mbps = 10
  }

  freeform_tags = var.tags
}

resource "oci_load_balancer_backend_set" "app" {
  load_balancer_id = oci_load_balancer_load_balancer.main.id
  name             = "${var.environment}-app-backend"
  policy           = "ROUND_ROBIN"

  health_checker {
    protocol = "HTTP"
    port     = var.backend_port
    url_path = "/healthz"
  }
}

resource "oci_load_balancer_backend" "app" {
  count = length(var.backend_instance_ocids)

  load_balancer_id = oci_load_balancer_load_balancer.main.id
  backend_set_name = oci_load_balancer_backend_set.app.name
  ip_address       = var.backend_instance_ips[count.index]
  port             = var.backend_port
}

resource "oci_load_balancer_listener" "http" {
  load_balancer_id         = oci_load_balancer_load_balancer.main.id
  name                     = "http"
  default_backend_set_name = oci_load_balancer_backend_set.app.name
  port                     = 80
  protocol                 = "HTTP"
}
