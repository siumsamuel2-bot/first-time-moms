resource "oci_objectstorage_bucket" "assets" {
  compartment_id = var.compartment_ocid
  namespace      = data.oci_objectstorage_namespace.ns.namespace
  name           = var.bucket_name
  access_type    = "NoPublicAccess"
  versioning     = "Disabled"

  freeform_tags = var.tags
}

data "oci_objectstorage_namespace" "ns" {
  compartment_id = var.compartment_ocid
}
