# ADR-007: Container-First Deployment with Terraform + GitHub Actions

## Status
Accepted

## Context
Firstweeks infrastructure requirements:
- Staging: Oracle Cloud Always Free (existing Terraform)
- Production: AWS/GCP with HIPAA BAA
- Single application container (modular monolith)
- PostgreSQL database (managed)
- Load balancer + TLS
- Object storage for assets
- CI/CD: Automated test → build → deploy
- Zero-downtime deployments
- Rollback capability
- Cost visibility

## Decision
**Container-First Deployment Pipeline:**

### Build (GitHub Actions)
1. **On PR**: Lint, typecheck, unit tests, build Docker image (multi-stage), push to GHCR (tagged with PR number)
2. **On merge to main**: 
   - Run full test suite (unit + integration + E2E)
   - Build production Docker image (distroless base, non-root)
   - Push to GHCR with semantic version tag + `latest`
   - Run Trivy security scan
   - Generate SBOM (Syft)

### Deploy Staging (Oracle Cloud)
- **Trigger**: Manual approval after main merge
- **Process**: 
  - Terraform plan/apply (infrastructure changes)
  - SSH to instances → pull new image → rolling restart (2 instances, 1 at a time)
  - Health check verification
  - Smoke test API endpoints

### Deploy Production (AWS/GCP)
- **Trigger**: Manual approval + compliance checklist
- **Process**:
  - Terraform plan/apply (infrastructure)
  - ECS Fargate / Cloud Run: Update service with new image tag
  - Blue-green or rolling deployment (ALB health checks)
  - Automated rollback on health check failure
  - Post-deploy smoke tests

### Infrastructure as Code
- **Terraform** for all environments (existing Oracle modules, new AWS/GCP modules)
- **Environment separation**: Separate state files, separate tfvars
- **Secrets**: GitHub Environments + OIDC for cloud auth (no long-lived keys)
- **State backend**: S3 + DynamoDB (AWS) / GCS (GCP) / OCI Object Storage (staging)

### Monitoring & Alerting
- **Logs**: Structured JSON (Pino) → CloudWatch / Cloud Logging / OCI Logging
- **Metrics**: Prometheus node exporter + application metrics → Grafana Cloud (free tier)
- **Traces**: OpenTelemetry → Jaeger (self-hosted) or Grafana Tempo
- **Alerts**: PagerDuty (on-call) for production critical

## Consequences

### Positive
- Immutable infrastructure: same image runs everywhere
- Reproducible builds: Docker + pinned dependencies
- Security: Distroless base, non-root, Trivy scanning
- GitOps-ready: declarative infrastructure
- Cost control: Terraform shows planned changes

### Negative
- Terraform learning curve for AWS/GCP modules
- Dual environment maintenance (Oracle + AWS/GCP)
- Container build time (~3-5 min)

### Neutral
- GHCR for container registry (free for public, included in GitHub)
- Semantic versioning: `v{major}.{minor}.{patch}`
- Database migrations: Run via Prisma Migrate in deployment job (before app start)

## Alternatives Considered

**Kubernetes (EKS/GKE/OCI OKE)**
- Rejected: Operational complexity overkill for single container, team unfamiliar
- Considered: Standard, scalable

**Serverless (AWS Lambda + API Gateway / Cloud Run)**
- Rejected: Cold starts, 15-min timeout, Prisma connection pooling issues, cost at scale
- Considered: Zero ops, auto-scale

**VM-based (Ansible/Packer + systemd)**
- Rejected: Mutable infrastructure, drift, slower deploys
- Considered: Simpler mental model

**PaaS (Render, Fly.io, Railway)**
- Rejected: No HIPAA BAA on most, vendor lock-in, less control
- Considered: Fastest to start

## References
- Existing: `infra/terraform/` for Oracle Cloud
- GitHub Actions: https://docs.github.com/en/actions
- Trivy: https://aquasecurity.github.io/trivy/
- Syft: https://github.com/anchore/syft
- Distroless: https://github.com/GoogleContainerTools/distroless