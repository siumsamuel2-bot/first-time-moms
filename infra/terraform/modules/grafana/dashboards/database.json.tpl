{
  "dashboard": {
    "title": "Firstweeks {{environment}} - Database",
    "uid": "firstweeks-{{environment}}-database",
    "tags": ["firstweeks", "{{environment}}", "database"],
    "timezone": "utc",
    "panels": [
      {
        "id": 1,
        "title": "RDS CPU Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_cpu_utilization{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "CPU %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 2,
        "title": "RDS Free Storage",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_free_storage_space{db_instance_identifier=\"{{db_instance_id}\"} / 1024 / 1024 / 1024",
            "legendFormat": "Free Storage (GB)",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 3,
        "title": "RDS Database Connections",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_database_connections{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "Connections",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 4,
        "title": "RDS Read/Write IOPS",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_read_iops{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "Read IOPS",
            "refId": "A"
          },
          {
            "expr": "aws_rds_write_iops{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "Write IOPS",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 12, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 5,
        "title": "RDS Read/Write Latency",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_read_latency{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "Read Latency (ms)",
            "refId": "A"
          },
          {
            "expr": "aws_rds_write_latency{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "Write Latency (ms)",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 0, "y": 16, "w": 12, "h": 8}
      },
      {
        "id": 6,
        "title": "RDS Buffer Cache Hit Ratio",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_buffer_cache_hit_ratio{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "Hit Ratio %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 16, "w": 12, "h": 8}
      },
      {
        "id": 7,
        "title": "RDS Network Throughput",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_network_receive_throughput{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "RX (bytes/s)",
            "refId": "A"
          },
          {
            "expr": "aws_rds_network_transmit_throughput{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "TX (bytes/s)",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 0, "y": 24, "w": 12, "h": 8}
      },
      {
        "id": 8,
        "title": "RDS Swap Usage",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_swap_usage{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "Swap Usage (bytes)",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 24, "w": 12, "h": 8}
      }
    ],
    "templating": {
      "list": [
        {
          "name": "DS_PROMETHEUS",
          "type": "datasource",
          "label": "Prometheus Data Source",
          "default": "prometheus",
          "query": "prometheus"
        }
      ]
    }
  }
}