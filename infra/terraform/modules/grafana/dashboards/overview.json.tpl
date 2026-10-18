{
  "dashboard": {
    "title": "Firstweeks {{environment}} - Overview",
    "uid": "firstweeks-{{environment}}-overview",
    "tags": ["firstweeks", "{{environment}}", "overview"],
    "timezone": "utc",
    "panels": [
      {
        "id": 1,
        "title": "API Health",
        "type": "stat",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_running_task_count{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}",
            "legendFormat": "Running Tasks",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 1},
                {"color": "green", "value": 2}
              ]
            },
            "unit": "short"
          }
        },
        "gridPos": {"x": 0, "y": 0, "w": 6, "h": 4}
      },
      {
        "id": 2,
        "title": "Web Health",
        "type": "stat",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_running_task_count{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-web\"}",
            "legendFormat": "Running Tasks",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 1},
                {"color": "green", "value": 2}
              ]
            },
            "unit": "short"
          }
        },
        "gridPos": {"x": 6, "y": 0, "w": 6, "h": 4}
      },
      {
        "id": 3,
        "title": "RDS Health",
        "type": "stat",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_cpu_utilization{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "CPU %",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 70},
                {"color": "red", "value": 90}
              ]
            },
            "unit": "percent"
          }
        },
        "gridPos": {"x": 12, "y": 0, "w": 6, "h": 4}
      },
      {
        "id": 4,
        "title": "ALB 5xx Error Rate",
        "type": "stat",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum(rate(aws_alb_httpcode_target_5xx_count{load_balancer=\"{{alb_name}\"}[5m]))",
            "legendFormat": "5xx/s",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 0.01},
                {"color": "red", "value": 0.1}
              ]
            },
            "unit": "reqps"
          }
        },
        "gridPos": {"x": 18, "y": 0, "w": 6, "h": 4}
      },
      {
        "id": 5,
        "title": "API CPU Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_cpu_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}",
            "legendFormat": "API CPU %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 4, "w": 12, "h": 8}
      },
      {
        "id": 6,
        "title": "API Memory Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_memory_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}",
            "legendFormat": "API Memory %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 4, "w": 12, "h": 8}
      },
      {
        "id": 7,
        "title": "Web CPU Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_cpu_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-web\"}",
            "legendFormat": "Web CPU %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 12, "w": 12, "h": 8}
      },
      {
        "id": 8,
        "title": "Web Memory Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_memory_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-web\"}",
            "legendFormat": "Web Memory %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 12, "w": 12, "h": 8}
      },
      {
        "id": 9,
        "title": "ALB Request Rate",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum(rate(aws_alb_request_count{load_balancer=\"{{alb_name}\"}[1m])) by (target_group)",
            "legendFormat": "{{target_group}}",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 20, "w": 12, "h": 8}
      },
      {
        "id": 10,
        "title": "ALB Target Response Time",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_alb_target_response_time{load_balancer=\"{{alb_name}\"}",
            "legendFormat": "Response Time",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 20, "w": 12, "h": 8}
      },
      {
        "id": 11,
        "title": "RDS CPU Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "aws_rds_cpu_utilization{db_instance_identifier=\"{{db_instance_id}\"}",
            "legendFormat": "RDS CPU %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 28, "w": 12, "h": 8}
      },
      {
        "id": 12,
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
        "gridPos": {"x": 12, "y": 28, "w": 12, "h": 8}
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