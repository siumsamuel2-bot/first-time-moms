# ADR-006: Technology Stack — TypeScript Full Stack (Node.js + React)

## Status
Accepted

## Context
Firstweeks needs:
- Backend API (REST) for PWA, clinician dashboard, webhooks
- Frontend PWA (React)
- Type safety across stack (shared types for API contracts)
- Team: 2-3 engineers, strong TypeScript/React experience
- HIPAA: Audit logging, encryption, access controls
- Deployment: Docker containers on Linux (OCI compute, later AWS Fargate)
- Timeline: MVP in 8-12 weeks

## Decision
**Unified TypeScript Stack:**

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Language** | TypeScript 5.x (strict mode) | End-to-end type safety, shared types, modern tooling |
| **Backend Framework** | Fastify + TypeBox | High performance, schema validation, OpenAPI generation, low overhead |
| **Frontend Framework** | React 18 + Vite + TypeScript | Team expertise, PWA support, ecosystem |
| **State Management** | TanStack Query (React Query) + Zustand | Server state + light client state, no Redux boilerplate |
| **UI Components** | Radix UI + Tailwind CSS | Accessible primitives, design system ready, fast styling |
| **Database ORM** | Prisma 5.x | Type-safe DB access, migrations, Prisma Studio, PostgreSQL support |
| **API Documentation** | Scalar (OpenAPI 3.1) | Interactive docs, generated from Fastify schemas |
| **Authentication** | JWT (access + refresh) + bcrypt/argon2 | Stateless, scalable, standard |
| **Validation** | TypeBox (backend) + Zod (frontend/shared) | Single schema source, TypeScript inference |
| **Testing** | Vitest (unit) + Playwright (E2E) | Fast, TypeScript-native, good DX |
| **Linting/Format** | Biome (replaces ESLint + Prettier) | Fast, unified, zero-config |
| **CI/CD** | GitHub Actions | Native integration, free for public/reasonable private |
| **Container** | Docker (multi-stage, distroless base) | Reproducible, secure, small images |
| **Observability** | Pino (structured logs) + OpenTelemetry (future) | JSON logs, standard instrumentation |

## Consequences

### Positive
- Single language across stack = shared types, less context switching
- Fastify: 2-3x Express throughput, lower latency
- Prisma: Type-safe DB, prevents N+1, easy migrations
- Biome: 10-20x faster than ESLint+Prettier
- Vite: Instant HMR, optimized builds
- Radix UI: Accessible by default (WCAG 2.1 AA)

### Negative
- Fastify ecosystem smaller than Express (mitigated: growing, compatible with many Express middlewares)
- Prisma: Cold start overhead in serverless (mitigated: Fargate/EC2, not Lambda)
- TypeBox learning curve (mitigated: similar to Zod, good docs)

### Neutral
- Node.js 20 LTS (current)
- pnpm for package management (faster, disk-efficient)
- Monorepo structure: `apps/api`, `apps/web`, `packages/shared`

## Alternatives Considered

**Python (FastAPI) + React**
- Rejected: Two languages, no shared types, team stronger in TypeScript
- Considered: Excellent ML ecosystem, FastAPI great for AI

**Go + React**
- Rejected: Team unfamiliar, slower iteration for web API
- Considered: Performance, single binary

**Next.js (Full Stack)**
- Rejected: Server components add complexity, prefer clear API/frontend separation for HIPAA audit trail, clinician dashboard is separate client
- Considered: Integrated, great DX

**tRPC instead of REST**
- Rejected: Clinician dashboard may be separate repo/team, REST more universal, OpenAPI standard
- Considered: End-to-end types without codegen

## References
- Fastify: https://fastify.dev/
- Prisma: https://www.prisma.io/
- TypeBox: https://github.com/sinclairzx81/typebox
- Biome: https://biomejs.dev/
- Radix UI: https://www.radix-ui.com/
- TanStack Query: https://tanstack.com/query