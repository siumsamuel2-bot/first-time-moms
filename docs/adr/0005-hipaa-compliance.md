# ADR-005: HIPAA Compliance Strategy — Staging vs Production

## Status
Accepted

## Context
Firstweeks handles Protected Health Information (PHI):
- User health data (delivery details, mental health scores, symptoms)
- Provider communications
- Clinician dashboard with patient identifiers

Regulatory requirements:
- HIPAA Privacy Rule: PHI access controls, minimum necessary
- HIPAA Security Rule: Administrative, physical, technical safeguards
- Breach Notification Rule: 60-day notification
- Business Associate Agreements (BAAs) with all vendors handling PHI

Constraints:
- Oracle Cloud Always Free tier: **No BAA available** (per Oracle policy)
- Pilot: 2 OB-GYN practices, 30 moms — real PHI
- Budget: Pre-revenue startup, limited infrastructure spend
- Timeline: Pilot in 8-12 weeks

## Decision
**Two-tier compliance strategy:**

### Staging (Oracle Always Free) — **No Real PHI**
- Synthetic/test data only
- No BAA required (no real PHI)
- Used for: Development, integration testing, demo, load testing
- Data: Generated via seed scripts, anonymized patterns
- Access: Team only

### Production (Dedicated HIPAA-Compliant Environment) — **Real PHI**
- **Cloud Provider**: AWS or GCP (both offer BAAs)
- **Infrastructure**: 
  - VPC with private subnets
  - RDS PostgreSQL (encrypted, automated backups, Multi-AZ)
  - ECS Fargate or EKS for containers
  - ALB with WAF
  - S3 (encrypted, versioned) for assets
  - CloudTrail + GuardDuty for audit logging
  - KMS for key management
- **BAAs Signed With**: Cloud provider, email (SendGrid/Twilio), SMS (Twilio), monitoring (Datadog), error tracking (Sentry)
- **No PHI in**: Logs, error tracking, analytics (mixpanel/amplitude — use de-identified events only)
- **Encryption**: TLS 1.3 everywhere, AES-256 at rest, envelope encryption for database
- **Access**: SSO (Okta/Auth0) with MFA, RBAC, audit logs
- **Backup/DR**: RPO < 1hr, RTO < 4hr, cross-region backup

### Pilot Execution
- Pilot runs on **Production** environment (real PHI requires BAA)
- Staging used for pre-pilot validation
- OB-GYN practices sign Data Use Agreement + BAA with Firstweeks

## Consequences

### Positive
- Clear separation: staging = innovation speed, production = compliance
- No BAA blockers for development iteration
- Pilot can proceed with real users on compliant infrastructure
- Cost-controlled: only production needs paid HIPAA infrastructure

### Negative
- Dual environment maintenance
- Promotion process: staging → production requires compliance review
- Production infrastructure cost (~$500-1000/month minimum)
- Cannot use Oracle Always Free for pilot

### Neutral
- Infrastructure as Code (Terraform) for both environments
- CI/CD promotes same container image, different tfvars
- De-identification pipeline for analytics export (institutional play)

## Alternatives Considered

**Single Environment (Oracle Always Free + BAA Exception)**
- Rejected: Oracle does not offer BAA on Any tier. Legal risk unacceptable.

**Self-Hosted On-Premises**
- Rejected: Operational burden, physical security, no team expertise

**HIPAA-Compliant PaaS (Aptible, Datica, TrueVault)**
- Rejected: Vendor lock-in, cost premium, less control
- Considered: Faster compliance, managed BAAs

**FHIR Server + SMART on FHIR**
- Rejected: Overkill for pilot, adds complexity
- Considered: Interoperability for institutional play

## References
- Oracle Cloud Free Tier: No BAA (https://www.oracle.com/cloud/free/)
- AWS BAA: https://aws.amazon.com/compliance/hipaa-compliance/
- GCP BAA: https://cloud.google.com/security/compliance/hipaa
- HIPAA Security Rule: 45 CFR § 164.308, .310, .312
- NIST 800-66: HIPAA Security Rule implementation guidance