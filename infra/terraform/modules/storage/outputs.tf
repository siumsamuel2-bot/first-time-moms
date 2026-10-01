output "bucket_name" {
  description = "Object Storage bucket name"
  value       = oci_objectstorage_bucket.assets.name
}

output "namespace" {
  description = "Object Storage namespace (also used for the Terraform state backend)"
  value       = data.oci_objectstorage_namespace.ns.namespace
}
