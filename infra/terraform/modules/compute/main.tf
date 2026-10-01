data "oci_core_images" "ol_aarch64" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Oracle Linux"
  operating_system_version = "9"
  shape                    = "VM.Standard.A1.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_instance" "app" {
  count = var.instance_count

  compartment_id      = var.compartment_ocid
  availability_domain = var.availability_domain
  display_name        = "${var.environment}-app-${count.index + 1}"
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = var.instance_ocpu
    memory_in_gbs = var.instance_memory_gb
  }

  source_details {
    source_type             = "image"
    source_id               = data.oci_core_images.ol_aarch64.images[0].id
    boot_volume_size_in_gbs = var.boot_volume_size_gb
  }

  create_vnic_details {
    subnet_id        = var.subnet_ocid
    assign_public_ip = true
    display_name     = "${var.environment}-app-vnic-${count.index + 1}"
    hostname_label   = "${var.environment}-app-${count.index + 1}"
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data           = base64encode(local.cloud_init)
  }

  agent_config {
    are_all_plugins_disabled = false
    is_management_disabled   = false
    is_monitoring_disabled   = false
  }

  freeform_tags = var.tags

  lifecycle {
    ignore_changes = [source_details]
  }
}

locals {
  cloud_init = <<-CLOUDINIT
    #cloud-config
    package_update: true
    packages:
      - podman
      - podman-docker
      - firewalld
    runcmd:
      - systemctl enable --now podman.socket
      - firewall-cmd --permanent --add-port=${var.app_port}/tcp
      - firewall-cmd --reload
      - podman run -d --name firstweeks-app --restart always -p ${var.app_port}:${var.app_port} ${var.app_container_image}
  CLOUDINIT
}

