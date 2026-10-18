output "alarm_topic_id" {
  description = "OCID of the alarm notification topic"
  value       = oci_ons_notification_topic.alarms.id
}

output "alarm_topic_name" {
  description = "Name of the alarm notification topic"
  value       = oci_ons_notification_topic.alarms.name
}