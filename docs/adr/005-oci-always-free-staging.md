# ADR-005: Oracle Cloud Always Free for Staging Infrastructure

**Status**: Accepted
**Date**: 2026-10-01
**Deciders**: Board, CTO

## Context

ADR-004 assumed AWS for staging/prod, but the board confirmed there is no AWS budget (see FIR-23, decision on 2026-09-30). Paid Render (~$100-200/mo) was comparable to paid AWS and would have required rewriting all Terraform anyway. Oracle Cloud Always Free was chosen as the zero-cost staging provider.

The pilot (30 first-time mothers, 2 OB-GYN practices) runs against staging. Staging must not contain real PHI (no HIPAA BAA is available on the free tier), so free-tier constraints are acceptable for this phase.

## Decision

Rebuild staging infrastructure OCI-native in `infra/terraform/` (replaces the AWS-era `infra/main.tf`):

| Concern | AWS (ADR-004) | OCI Always Free (this ADR) |
| --- | --- | --- |
| Compute | ECS Fargate | 2x VM.Standard.A1.Flex (ARM, 4 OCPU/24 GB total) |
| Database | RDS PostgreSQL | Autonomous Database (1 OCPU, 20 GB) |
| Load balancing | ALB | Flexible LB (10 Mbps free tier) |
| Object storage | S3 | Object Storage (20 GB) |
| DNS/TLS | Route53 + ACM | OCI DNS or Let's Encrypt |
| State backend | S3 + DynamoDB locks | Object Storage (single-operator, no locking) |
| Container runtime | Fargate tasks | Podman via cloud-init on Oracle Linux 9 |

### Always Free capacity encoded in Terraform
- 4 ARM OCPUs / 24 GB RAM total across the A1.Flex app tier (2x 2 OCPU / 12 GB)
- 1 free Autonomous Database instance
- 10 Mbps flexible load balancer
- 20 GB object storage bucket (also used for Terraform state)

### Data protection carried over from ADR-004
- TLS in transit on all connections
- Row-level security policies scoped by `patient_id`
- Audit logging for all PHI access
- No PHI in logs or error reporting

## Consequences
+ Zero infrastructure cost during pilot phase
+ Capacity (4 cores/24 GB, 2 LBs, 10 TB egress) exceeds staging needs
+ Infra-as-code is repo-resident (previously lost to session cleanup once)
- No HIPAA BAA on free tier: staging only, no real PHI; BAAs still required before production with PHI
- Different provider (`oci` vs `aws`) and OCI-specific Terraform knowledge required
- Free-tier ARM capacity is reclaimed if idle for 7 days; keep a minimum baseline of activity or re-provision via Terraform
- `terraform apply` remains blocked until the board provides an OCI account, credentials (tenancy/user OCID, fingerprint, private key, region), and the staging domain

## Links
- [Terraform config](/FIR/infra/terraform/main.tf)
- [Deployment runbook](/FIR/docs/deployment-runbook)
- [FIR-198](/FIR/issues/FIR-198) (OCI Terraform rewrite)
- [FIR-191](/FIR/issues/FIR-191) (terraform apply, pending credentials)
- [ADR-004](/FIR/docs/adr/004-hipaa-compliance-and-infrastructure) (superseded infra strategy)
