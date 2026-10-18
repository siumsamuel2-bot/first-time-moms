{
  "dashboard": {
    "title": "Firstweeks {{environment}} - Business Metrics",
    "uid": "firstweeks-{{environment}}-business",
    "tags": ["firstweeks", "{{environment}}", "business"],
    "timezone": "utc",
    "panels": [
      {
        "id": 1,
        "title": "Daily Active Users",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "firstweeks_dau",
            "legendFormat": "DAU",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 2,
        "title": "Check-in Completion Rate",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "firstweeks_checkin_completion_rate",
            "legendFormat": "Completion Rate %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 0, "w": 12, "h": 8}
      },
      {
        "id": 3,
        "title": "Escalation Rate (per 100 moms)",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "firstweeks_escalation_rate_per_100",
            "legendFormat": "Escalations/100 moms",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 4,
        "title": "Referral Conversion Rate",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "firstweeks_referral_conversion_rate",
            "legendFormat": "Conversion Rate %",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 8, "w": 12, "h": 8}
      },
      {
        "id": 5,
        "title": "Average Risk Score by Week Postpartum",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "firstweeks_avg_risk_score_by_week",
            "legendFormat": "Week {{week_postpartum}}",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 16, "w": 12, "h": 8}
      },
      {
        "id": 6,
        "title": "Provider Match Quality Score Distribution",
        "type": "timeseries",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "firstweeks_provider_match_score",
            "legendFormat": "Match Score",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 16, "w": 12, "h": 8}
      },
      {
        "id": 7,
        "title": "Escalation Triggers Breakdown",
        "type": "piechart",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum by (trigger) (firstweeks_escalations_total)",
            "legendFormat": "{{trigger}}",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 0, "y": 24, "w": 12, "h": 8}
      },
      {
        "id": 8,
        "title": "Referral Status Breakdown",
        "type": "piechart",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "sum by (status) (firstweeks_referrals_total)",
            "legendFormat": "{{status}}",
            "refId": "A"
          }
        ],
        "gridPos": {"x": 12, "y": 24, "w": 12, "h": 8}
      },
      {
        "id": 9,
        "title": "Retention (D1, D7, D30)",
        "type": "table",
        "datasource": "${DS_PROMETHEUS}",
        "targets": [
          {
            "expr": "firstweeks_retention_d1",
            "legendFormat": "D1 Retention %",
            "refId": "A"
          },
          {
            "expr": "firstweeks_retention_d7",
            "legendFormat": "D7 Retention %",
            "refId": "B"
          },
          {
            "expr": "firstweeks_retention_d30",
            "legendFormat": "D30 Retention %",
            "refId": "C"
          }
        ],
        "gridPos": {"x": 0, "y": 32, "w": 24, "h": 8}
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