# ADR-004: HIPAA Compliance and Infrastructure Strategy

**Status**: Accepted
**Date**: 2026-06-07
**Deciders**: CTO

## Context

Firstweeks handles protected health information (PHI) including delivery dates, mental health assessments, and symptom reports. The pilot involves 2 OB-GYN practices and 30 patients. A BAA with AWS is already in place for the infrastructure provider.

## Decision

### Data Protection
1. **Encryption at rest**: AWS RDS with `storage_encrypted = true` (AES-256)
2. **Encryption in transit**: TLS 1.3 enforced on all connections
3. **Row-level security**: PostgreSQL RLS policies scoped by `patient_id` so clinicians only see their own patients
4. **Audit logging**: All PHI access logged to `audit_logs` table with action, resource type, and timestamp
5. **No PHI in logs/sentry**: Structured logging strips PHI fields; error reporting excludes request bodies

### Infrastructure (Current)
- **Local dev**: Docker Compose with PostgreSQL 16
- **CI**: GitHub Actions (no PHI in CI)
- **Staging/Prod**: AWS ECS Fargate + RDS (Terraform in `infra/main.tf`)

### Future (Before Prod with PHI)
- Sign BAAs with: AWS (existing), OpenAI (for LLM tier), and any email/SMS provider
- AWS WAF for API protection
- VPC with private subnets for RDS
- Secrets Manager for `DATABASE_URL` and API keys
- Penetration test before full production deployment

### Pilot Data Flow
- All 30 pilot patients store data in a dedicated RDS instance
- De-identified export pipeline for institutional play (strips PII, retains outcome metrics)
- Export uses separate IAM role with read-only access to de-identified views

## Consequences
+ HIPAA-compliant foundation from day one
+ Audit trail satisfies clinician requirements for pilot
+ RLS provides multi-tenant data isolation for future practice expansion
- Additional complexity for local development (need to mock RLS)
- BAA overhead for each third-party service

## Links
- [Terraform config](/FIR/infra/main.tf)
- [Audit log schema](/FIR/packages/db/src/schema/index.ts)
- [ADR-001](/FIR/docs/adr/001-technology-stack)