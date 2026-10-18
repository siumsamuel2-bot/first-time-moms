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

resource "oci_monitoring_alarm" "api_high_cpu" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-api-high-cpu"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_computeagent"
  query                        = "CpuUtilization[1m].mean() > ${var.cpu_threshold}"
  severity                     = "CRITICAL"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "API CPU utilization is above ${var.cpu_threshold}%"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_monitoring_alarm" "api_high_memory" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-api-high-memory"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_computeagent"
  query                        = "MemoryUtilization[1m].mean() > ${var.memory_threshold}"
  severity                     = "CRITICAL"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "API memory utilization is above ${var.memory_threshold}%"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_monitoring_alarm" "web_high_cpu" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-web-high-cpu"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_computeagent"
  query                        = "CpuUtilization[1m].mean() > ${var.cpu_threshold}"
  severity                     = "CRITICAL"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "Web CPU utilization is above ${var.cpu_threshold}%"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_monitoring_alarm" "web_high_memory" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-web-high-memory"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_computeagent"
  query                        = "MemoryUtilization[1m].mean() > ${var.memory_threshold}"
  severity                     = "CRITICAL"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "Web memory utilization is above ${var.memory_threshold}%"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_monitoring_alarm" "load_balancer_high_latency" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-lb-high-latency"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_lbaas"
  query                        = "Latency[1m].mean() > ${var.latency_threshold}"
  severity                     = "WARNING"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "Load balancer latency is above ${var.latency_threshold}ms"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_monitoring_alarm" "load_balancer_5xx_errors" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-lb-5xx-errors"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_lbaas"
  query                        = "Http5xxErrorCount[1m].sum() > ${var.error_threshold}"
  severity                     = "CRITICAL"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "Load balancer 5xx errors exceed threshold"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_monitoring_alarm" "database_high_cpu" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-db-high-cpu"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_database"
  query                        = "CpuUtilization[1m].mean() > ${var.db_cpu_threshold}"
  severity                     = "CRITICAL"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "Database CPU utilization is above ${var.db_cpu_threshold}%"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_monitoring_alarm" "database_high_storage" {
  compartment_id               = var.compartment_id
  display_name                 = "${var.environment}-db-high-storage"
  metric_compartment_id        = var.compartment_id
  namespace                    = "oci_database"
  query                        = "StorageUtilization[1m].mean() > ${var.db_storage_threshold}"
  severity                     = "WARNING"
  destinations                 = var.alarm_topic_id != "" ? [var.alarm_topic_id] : []
  body                         = "Database storage utilization is above ${var.db_storage_threshold}%"
  is_enabled                   = true
  repeat_notification_duration = "PT1H"

  freeform_tags = local.tags
}

resource "oci_ons_notification_topic" "alarms" {
  compartment_id = var.compartment_id
  name           = "${var.environment}-alarms"
  description    = "Topic for monitoring alarms"
  freeform_tags  = local.tags
}

resource "oci_ons_subscription" "email" {
  count          = var.alarm_email != "" ? 1 : 0
  compartment_id = var.compartment_id
  topic_id       = oci_ons_notification_topic.alarms.id
  protocol       = "EMAIL"
  endpoint       = var.alarm_email
}
