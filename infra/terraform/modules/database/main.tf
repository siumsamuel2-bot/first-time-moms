resource "oci_database_autonomous_database" "main" {
  compartment_id           = var.compartment_ocid
  display_name             = var.db_display_name
  db_name                  = var.db_name
  db_workload              = "OLTP"
  is_free_tier             = true
  admin_password           = var.db_admin_password
  is_auto_scaling_enabled  = false
  data_storage_size_in_tbs = 1

  # Always Free ATP: 1 OCPU, 20 GB storage, no auto scaling.
  cpu_core_count = 1

  freeform_tags = var.tags
}
