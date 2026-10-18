{
  "dashboard": {
    "title": "Firstweeks {{environment}} - API",
    "uid": "firstweeks-{{environment}}-api",
    "tags": ["firstweeks", "{{environment}}", "api"],
    "timezone": "utc",
    "panels": [
      {
        "id": 1,
        "title": "API Request Rate",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{service=\"api\"}[1m])) by (method, path, status)",
            "legendFormat": "{{method}} {{path}} {{status}}",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 2,
        "title": "API Request Latency (p50, p95, p99)",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket{service=\"api\"}[5m])) by (le))",
            "legendFormat": "p50",
            "refId": "A"
          },
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service=\"api\"}[5m])) by (le))",
            "legendFormat": "p95",
            "refId": "B"
          },
          {
            "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service=\"api\"}[5m])) by (le))",
            "legendFormat": "p99",
            "refId": "C"
          }
        ],
        "gridPos": {"x": 12, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 3,
        "title": "API Error Rate",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{service=\"api\",status=~\"5..\"}[1m]))",
            "legendFormat": "5xx/s",
            "refId": "A"
          },
          {
            "expr": "sum(rate(http_requests_total{service=\"api\",status=~\"4..\"}[1m]))",
            "legendFormat": "4xx/s",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 0, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 4,
        "title": "API CPU Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_cpu_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}",
            "legendFormat": "CPU %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 5,
        "title": "API Memory Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_memory_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}",
            "legendFormat": "Memory %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 16, "w": 12, "h": 8}
      },
      {
        "id": 6,
        "title": "API Running Tasks",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_running_task_count{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}",
            "legendFormat": "Running Tasks",
            "refId": "A"
          },
          {
            "expr": "ecs_service_desired_task_count{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}",
            "legendFormat": "Desired Tasks",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 12, "y": 16, "w": 12, "h": 8}
      },
      {
        "id": 7,
        "title": "API Network I/O",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "rate(ecs_task_network_rx_bytes{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}[1m])",
            "legendFormat": "RX bytes/s",
            "refId": "A"
          },
          {
            "expr": "rate(ecs_task_network_tx_bytes{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-api\"}[1m])",
            "legendFormat": "TX bytes/s",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 0, "y": 24, "w": 12, "h": 8}
      },
      {
        "id": 8,
        "title": "API Database Connections",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "pg_stat_activity_count{datname=\"firstweeks\"}",
            "legendFormat": "Active Connections",
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