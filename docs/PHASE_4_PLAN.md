# Phase 4: Production Hardening & Pilot Launch Plan

## Overview
Transition from staging (Oracle Cloud Always Free) to production-ready infrastructure with BAA compliance, de-identified analytics pipeline, security hardening, and pilot launch with 2 OB-GYN practices (30 first-time mothers).

## Timeline: Weeks 10-12 (Target: 2026-12-06)

---

## 1. Production Infrastructure (AWS with BAA)

### Architecture Decision: AWS over GCP
**Rationale**: Better BAA coverage, more mature HIPAA-eligible services, team familiarity.

### Core Services (All HIPAA-eligible with BAA)

| Component | Service | Configuration |
|-----------|---------|---------------|
| Compute | ECS Fargate | 2 tasks (API + Web), auto-scaling, private subnets |
| Load Balancer | Application Load Balancer | WAF enabled, TLS 1.2+, cert via ACM |
| Database | RDS PostgreSQL 16 | Multi-AZ, db.t3.medium, encrypted at rest, automated backups (35-day retention) |
| Secrets | AWS Secrets Manager | JWT secret, DB password, VAPID keys, rotation enabled |
| Storage | S3 | Versioned, encrypted, block public access |
| Monitoring | CloudWatch + Grafana Cloud | Logs, metrics, alerts, dashboards |
| DNS/CDN | CloudFront + Route 53 | Edge caching, custom domain, WAF integration |
| CI/CD | GitHub Actions → ECR → ECS | OIDC auth, no static keys |
| Network | VPC | 3 AZs, private/public subnets, NAT Gateway, VPC endpoints |

### Terraform Modules to Create/Update
```
infra/terraform/
├── modules/
│   ├── compute/          # ECS cluster, services, task definitions
│   ├── database/         # RDS PostgreSQL Multi-AZ
│   ├── loadbalancer/     # ALB, WAF, target groups
│   ├── network/          # VPC, subnets, NAT, endpoints
│   ├── storage/          # S3 buckets, CloudFront
│   ├── monitoring/       # CloudWatch log groups, alarms
│   └── security/         # IAM roles, Security Groups, KMS keys
├── environments/
│   ├── production/
│   └── staging/
```

### Environment Variables (Production)
```bash
# Required for production
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/firstweeks
JWT_SECRET=[from Secrets Manager]
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute
CORS_ORIGIN=https://app.firstweeks.app
PUSH_VAPID_PUBLIC_KEY=[from Secrets Manager]
PUSH_VAPID_PRIVATE_KEY=[from Secrets Manager]
PUSH_VAPID_SUBJECT=mailto:admin@firstweeks.app
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
```

### Deployment Pipeline
1. **GitHub Actions**: lint → typecheck → test:unit → build → test:integration → test:e2e
2. **On merge to main**: Build Docker images → Push to ECR → Deploy to staging
3. **Manual promotion**: staging → production (with approval gate)
4. **Rollback**: One-click via GitHub Actions or ECS console

---

## 2. De-identified Analytics Pipeline

### Data Flow
```
Production PostgreSQL (RDS)
    │
    ▼
CDC via Debezium (or pg_cron + pg_dump for simplicity)
    │
    ▼
De-identification Lambda/ECS Task
    ├─ Remove: email, name, IP, userAgent, exact timestamps
    ├─ Hash: user_id → salted SHA-256 (consistent per user)
    ├─ Generalize: dates → week/month buckets, location → zip code prefix
    └─ Suppress: small cell counts (< 11)
    │
    ▼
S3 (Parquet, partitioned by year/month/day)
    │
    ▼
Athena Tables (Glue Catalog)
    │
    ▼
Metabase Dashboards (connected to Athena)
```

### De-identification Rules
| Field | Transformation |
|-------|----------------|
| user.email | REMOVED |
| user.id | HASHED (salted SHA-256, consistent) |
| check-in.date | GENERALIZED to ISO week (YYYY-WW) |
| provider.location | GENERALIZED to zip code prefix (3-digit) |
| escalation.contextSummary | REMOVED (contains potential PHI) |
| referral.contextSummary | REMOVED |
| clinical notes | REMOVED entirely |
| audit logs | IP removed, userAgent removed, user_id hashed |

### Key Metrics Tables
1. **daily_active_users** - DAU/WAU/MAU, retention (D1, D7, D30)
2. **checkin_completion** - completion rate by week postpartum, by cohort
3. **escalation_rate** - per 100 moms, by trigger type, by week
4. **referral_conversion** - referral → consent → appointment → completion
5. **risk_score_trends** - average risk score by week postpartum
6. **provider_match_quality** - match score distribution, appointment booked rate

### Implementation Steps
1. [ ] Create Debezium connector or pg_cron export job
2. [ ] Build de-identification Lambda (Python, < 5 min runtime)
3. [ ] Create S3 bucket with lifecycle policies
4. [ ] Define Athena tables (CTAS from Parquet)
5. [ ] Build Metabase dashboards
6. [ ] Schedule daily refresh (02:00 UTC)

---

## 3. Security Hardening

### Penetration Testing (Week 10)
- **Scope**: API endpoints, auth flows, PWA, database access
- **Methodology**: OWASP Top 10 + HIPAA-specific tests
- **Provider**: Third-party (e.g., Bishop Fox, Coalfire, or similar)
- **Deliverable**: Report with CVSS scores, remediation timeline

### Automated Security Scanning
| Tool | Integration | Frequency |
|------|-------------|-----------|
| Trivy | GitHub Actions (container scan) | Every build |
| npm audit | GitHub Actions | Every PR |
| Snyk/Dependabot | GitHub (auto-PRs) | Weekly |
| Semgrep | GitHub Actions | Every PR |
| TruffleHog | GitHub Actions (secrets) | Every push |

### Compliance Checklist
- [ ] BAA signed with AWS
- [ ] BAA signed with SendGrid (email)
- [ ] BAA signed with Twilio (SMS, if used)
- [ ] BAA signed with Grafana Cloud (monitoring)
- [ ] Encryption at rest: RDS, S3, EBS, Secrets Manager
- [ ] Encryption in transit: TLS 1.2+ everywhere, ALB enforces HTTPS
- [ ] Access logging: CloudTrail (all regions), ALB access logs, RDS audit logs
- [ ] Backup/restore tested: Point-in-time recovery verified
- [ ] Incident response runbook documented
- [ ] Business continuity plan: RPO < 1hr, RTO < 4hr

### Hardening Tasks
- [ ] WAF rules: OWASP Core Rule Set + custom rate limiting
- [ ] Security Groups: Least privilege (ALB → ECS only, ECS → RDS only)
- [ ] IAM: No wildcards, condition keys for secrets access
- [ ] VPC Flow Logs: Enabled, sent to CloudWatch
- [ ] GuardDuty: Enabled, findings to Security Hub
- [ ] Config Rules: Encryption, public access, backup compliance

---

## 4. Pilot Launch Preparation

### Practice Onboarding (2 OB-GYN Practices)
| Task | Owner | Timeline |
|------|-------|----------|
| Practice agreements signed | CMO | Week 9 |
| Clinician accounts created (5-6 per practice) | CTO | Week 10 |
| Provider directory populated (15-20 screened providers) | CMO/CTO | Week 10 |
| Practice-specific config (branding, workflows) | CTO | Week 10 |
| Staff training sessions (2 hrs each) | CMO | Week 11 |
| Test mom accounts (5 per practice) | CTO | Week 11 |
| Go-live support schedule | CTO/CMO | Week 12 |

### Mom Recruitment (30 first-time mothers)
| Criteria | Details |
|----------|---------|
| Inclusion | First-time mom, 28-40 weeks gestation, English-speaking, smartphone access |
| Exclusion | High-risk pregnancy requiring specialized monitoring, non-English speaking |
| Recruitment | Practice staff at prenatal visits (36-38 weeks) |
| Consent | Digital via app (HIPAA-compliant) |
| Compensation | $50 gift card at 6 weeks postpartum |

### Success Criteria (Pilot)
| Metric | Target |
|--------|--------|
| Mom enrollment | 30/30 (100%) |
| Daily check-in completion | > 70% average |
| Escalation rate | 10-20 per 100 moms (expected) |
| Referral conversion | > 50% of escalations → referral |
| App stability | 99.9% uptime, < 200ms p95 API |
| Data quality | < 5% missing check-ins |
| Clinician satisfaction | > 4/5 on usability survey |

### Monitoring During Pilot
- **Real-time**: Grafana dashboards (DAU, check-ins, escalations, errors)
- **Daily**: Automated report to CTO/CMO (Slack/email)
- **Weekly**: Review meeting with practices
- **Incident**: PagerDuty/on-call for critical issues

### Go/No-Go Decision (End of Week 12)
| Gate | Criteria |
|------|----------|
| Technical | All severity 1/2 bugs fixed, uptime > 99.9% |
| Clinical | Escalation algorithm validated by CMO, false positive rate < 15% |
| Operational | Support load manageable (< 2 hrs/day), practices satisfied |
| Data | Analytics pipeline producing clean de-identified data |

---

## 5. Resource Requirements

### Team Allocation (Phase 4)
| Role | Week 10 | Week 11 | Week 12 |
|------|---------|---------|---------|
| CTO | Infra, security, pilot ops | Pilot support, bug fixes | Pilot support, go/no-go |
| Engineer 1 (hire) | Frontend polish, pilot bugs | Pilot support, analytics | Pilot support, retrospective |
| Engineer 2 (hire) | Backend, infra, analytics | Analytics pipeline, load test | Security hardening, docs |
| CMO | Practice onboarding, training | Clinical validation, support | Clinical validation, outcomes |

### Budget (Monthly Production)
| Item | Cost |
|------|------|
| ECS Fargate (2 tasks + ALB) | $300-500 |
| RDS PostgreSQL Multi-AZ (db.t3.medium) | $200-400 |
| S3 + CloudFront + Data Transfer | $50-100 |
| Secrets Manager + KMS | $20-40 |
| CloudWatch + Grafana Cloud Pro | $100-200 |
| SendGrid (email) | $50 |
| Route 53 + ACM | $15 |
| **Total** | **~$735-1,305/month** |

---

## 6. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| BAA negotiation delays | Medium | High | Start Week 8, have fallback vendors |
| RDS Multi-AZ failover issues | Low | High | Test failover in staging, document runbook |
| Analytics pipeline data quality | Medium | Medium | Unit tests for de-id logic, manual review week 1 |
| Pilot recruitment shortfall | Medium | High | Over-recruit (target 40), flexible criteria |
| Clinician adoption resistance | Medium | High | Training, dedicated support, simple UI |
| Push notification iOS issues | High | Medium | Test on iOS 16.4+, Capacitor wrapper ready |

---

## 7. Deliverables Checklist

### Week 10 (Infrastructure & Security)
- [ ] Production Terraform applied
- [ ] BAA signed with all vendors
- [ ] Penetration test scheduled
- [ ] Security scanning integrated in CI
- [ ] De-identification Lambda deployed
- [ ] Metabase dashboards live (staging data)

### Week 11 (Pilot Prep)
- [ ] Practice agreements signed
- [ ] Clinician accounts created
- [ ] Provider directory populated
- [ ] Staff training completed
- [ ] Test mom accounts verified
- [ ] Load testing completed (target: 1000 concurrent users)

### Week 12 (Pilot Launch)
- [ ] 30 moms enrolled
- [ ] Daily monitoring operational
- [ ] Incident response tested
- [ ] Go/no-go decision documented
- [ ] Pilot retrospective scheduled

---

## 8. Post-Pilot (Phase 5 Preview)

### Technical Investments
- Event-driven architecture (EventBridge/Kafka) for analytics
- Read replicas for reporting queries
- Feature flags (LaunchDarkly or custom)
- A/B testing framework for question variants
- Multi-region deployment (us-east-1 + us-west-2)

### Scale Targets
- 1,000+ moms by Q2 2027
- 10+ OB-GYN practices
- Sub-100ms p95 API
- 99.99% uptime

---

*Document Owner: CTO | Created: 2026-10-06 | Review: Weekly during Phase 4*