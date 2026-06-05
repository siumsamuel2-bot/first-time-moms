# ADR-001: Technology Stack

## Status
Accepted

## Context
Firstweeks needs a stack that supports rapid iteration, strong type safety for a healthcare-adjacent domain, real-time scheduled check-ins, mobile push notifications, and HIPAA compliance readiness.

## Decision
- **Backend Runtime**: Node.js 20+ (TypeScript) — largest healthcare-adjacent ecosystem, strong async I/O for check-in scheduling.
- **Web Framework**: Next.js 14 (App Router) — server components for data-heavy profile pages, API routes, edge caching.
- **Database**: PostgreSQL 16 — JSONB for flexible profiles, ACID for escalations, pgvector for similarity queries.
- **ORM**: Drizzle — type-safe SQL-like API, lightweight, PostGIS support.
- **AI**: OpenAI GPT-4 + custom triage classifier — BAA available; Llama 3 fallback for offline clinics.
- **Auth**: NextAuth.js v5 — OAuth (consumer) + JWT (clinician).
- **Mobile**: React Native (Expo) — shared types with web, native push notifications.
- **Infrastructure**: Docker Compose (dev) → AWS ECS Fargate (prod), Terraform.
- **CI/CD**: GitHub Actions.
- **Testing**: Vitest, Playwright, k6.

## Consequences
- Fast prototyping with shared TypeScript across web/mobile.
- HIPAA BAA required with OpenAI and cloud provider before prod data.
- Monorepo overhead managed via npm workspaces.