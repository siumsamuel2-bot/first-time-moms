{
  "dashboard": {
    "title": "Firstweeks {{environment}} - Web",
    "uid": "firstweeks-{{environment}}-web",
    "tags": ["firstweeks", "{{environment}}", "web"],
    "timezone": "utc",
    "panels": [
      {
        "id": 1,
        "title": "Web Request Rate",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{service=\"web\"}[1m])) by (method, path, status)",
            "legendFormat": "{{method}} {{path}} {{status}}",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 2,
        "title": "Web Request Latency (p50, p95, p99)",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket{service=\"web\"}[5m])) by (le))",
            "legendFormat": "p50",
            "refId": "A"
          },
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service=\"web\"}[5m])) by (le))",
            "legendFormat": "p95",
            "refId": "B"
          },
          {
            "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service=\"web\"}[5m])) by (le))",
            "legendFormat": "p99",
            "refId": "C"
          }
        ],
        "gridPos": {"x": 12, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 3,
        "title": "Web Error Rate",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{service=\"web\",status=~\"5..\"}[1m]))",
            "legendFormat": "5xx/s",
            "refId": "A"
          },
          {
            "expr": "sum(rate(http_requests_total{service=\"web\",status=~\"4..\"}[1m]))",
            "legendFormat": "4xx/s",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 0, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 4,
        "title": "Web CPU Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_cpu_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-web\"}",
            "legendFormat": "CPU %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 5,
        "title": "Web Memory Utilization",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_memory_utilization{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-web\"}",
            "legendFormat": "Memory %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 16, "w": 12, "h": 8}
      },
      {
        "id": 6,
        "title": "Web Running Tasks",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "ecs_service_running_task_count{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-web\"}",
            "legendFormat": "Running Tasks",
            "refId": "A"
          },
          {
            "expr": "ecs_service_desired_task_count{cluster_name=\"{{cluster_name}}\",service_name=\"{{environment}}-firstweeks-web\"}",
            "legendFormat": "Desired Tasks",
            "refId": "B"
          }
        ],
        "gridPos": {"x": 12, "y": 16, "w": 12, "h": 8}
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