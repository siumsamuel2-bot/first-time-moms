# Firstweeks — Postpartum Support App

A personalized postpartum support app for first-time moms with AI-driven daily check-ins, symptom escalation, and provider matching.

## Architecture

- **Modular Monolith** (ADR-001) — Single deployable unit with clear domain boundaries
- **PostgreSQL** (ADR-002) — Primary database with JSONB for flexible profiles
- **Rule-Based AI + Optional LLM** (ADR-003) — Explainable symptom triage
- **PWA** (ADR-004) — Mobile-first, installable, offline-capable
- **HIPAA Two-Tier** (ADR-005) — Staging (no PHI) + Production (BAA)
- **TypeScript Full Stack** (ADR-006) — Fastify + React + Prisma
- **Container-First Deployment** (ADR-007) — Terraform + GitHub Actions

See [docs/adr/](docs/adr/) for all Architecture Decision Records.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript 5.x (strict) |
| Backend | Fastify + TypeBox + Prisma |
| Frontend | React 18 + Vite + TanStack Query |
| UI | Radix UI + Tailwind CSS |
| Database | PostgreSQL (Oracle Autonomous DB / AWS RDS) |
| Auth | JWT (access + refresh) + Argon2 |
| Testing | Vitest + Playwright |
| Linting | Biome |
| CI/CD | GitHub Actions + Docker |
| Infra | Terraform (Oracle Cloud / AWS) |

## Project Structure

```
firstweeks/
├── apps/
│   ├── api/          # Fastify backend
│   └── web/          # React PWA
├── packages/
│   └── shared/       # Shared types, schemas, rules
├── docs/
│   ├── adr/          # Architecture Decision Records
│   └── TECHNICAL_ROADMAP.md
├── infra/
│   └── terraform/    # Oracle Cloud / AWS infrastructure
├── docker-compose.yml
└── package.json      # pnpm workspace root
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Local Development

```bash
# Install dependencies
pnpm install

# Start local database and services
docker compose up -d

# Run database migrations
pnpm db:migrate

# Start development servers (API + Web)
pnpm dev
```

- API: http://localhost:8080
- Web: http://localhost:5173
- API Docs: http://localhost:8080/docs
- Database: `postgresql://postgres:postgres@localhost:5432/firstweeks`

### Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes (dev)
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

## API Endpoints

### Authentication
- `POST /auth/signup` — Register new user
- `POST /auth/login` — Login
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Logout
- `GET /auth/me` — Get current user

### Onboarding
- `POST /onboarding/quiz` — Submit onboarding responses
- `GET /onboarding/quiz` — Get user's onboarding
- `GET /onboarding/profile` — Get computed recovery profile
- `GET /questions/today` — Get today's targeted questions

### Check-ins
- `POST /check-ins` — Submit daily check-in
- `GET /check-ins` — List check-ins (paginated)
- `GET /check-ins/trends` — Get computed trends
- `GET /escalations` — List user's escalations

### Clinician (requires CLINICIAN/ADMIN role)
- `GET /clinician/patients` — Patient list with risk summary
- `GET /clinician/escalations` — Escalation queue
- `GET /clinician/patients/:id` — Patient detail
- `POST /clinician/patients/:id/notes` — Add clinical note
- `PATCH /clinician/escalations/:id` — Update escalation
- `GET /providers` — Provider directory
- `POST /providers` — Create provider (ADMIN)
- `GET /referrals` — List referrals
- `PATCH /referrals/:id` — Update referral status

## Rule Engine

The symptom triage uses a deterministic, explainable rule engine:

```typescript
// Escalation triggers (evaluated daily)
- 5+ days sleep disruption (>=4/5) + sadness (>=3/5) → CRITICAL
- 7+ days sleep disruption → HIGH
- 7+ days sadness → HIGH
- Pain level >= 9 → HIGH
- Heavy bleeding 2+ days → HIGH

// Question selection adapts to profile
- C-section → incision, mobility questions
- Breastfeeding → latch, nipple pain, supply questions
- Recent sadness/anxiety → PHQ-2/GAD-2 follow-up
- 5+ days sleep disruption → sleep deep-dive
```

See `packages/shared/src/rules/` for implementation.

## Deployment

### Staging (Oracle Cloud Always Free)

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your OCI credentials
terraform init -backend-config=backend.hcl
terraform plan
terraform apply
```

### Production (AWS with HIPAA BAA)

1. Sign BAAs with AWS, SendGrid, Twilio, monitoring vendors
2. Deploy Terraform in `infra/terraform/aws/` (to be created)
3. Configure GitHub Actions secrets for AWS credentials
4. Push to `main` branch triggers deployment

## Testing

```bash
# Unit tests
pnpm test:unit

# Integration tests (API)
pnpm --filter=@firstweeks/api test:integration

# E2E tests (Web)
pnpm --filter=@firstweeks/web test:e2e
```

## Security

- Argon2 password hashing
- JWT with short-lived access tokens (15min) + refresh tokens (7d)
- HttpOnly, Secure, SameSite cookies
- Rate limiting (100 req/min)
- Helmet security headers
- CORS restricted to known origins
- Structured audit logging
- Trivy container scanning in CI
- SBOM generation (Syft)

## HIPAA Compliance

- **Staging**: No real PHI, Oracle Free Tier (no BAA)
- **Production**: AWS/GCP with signed BAAs
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Audit logging via CloudTrail/Cloud Audit Logs
- Access controls: RBAC, MFA, SSO
- No PHI in logs, error tracking, or analytics
- De-identification pipeline for institutional analytics

## Contributing

1. Create feature branch from `main`
2. Make changes with tests
3. Run `pnpm lint && pnpm typecheck && pnpm test:unit`
4. Open PR with description
5. CI must pass before merge

## License

UNLICENSED — Proprietary to Firstweeks