# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for Firstweeks.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-application-architecture.md) | Modular Monolith Architecture | Accepted | 2026-10-04 |
| [0002](0002-database-selection.md) | PostgreSQL as Primary Database | Accepted | 2026-10-04 |
| [0003](0003-ai-symptom-triage.md) | AI-Driven Symptom Triage (Rules + LLM) | Accepted | 2026-10-04 |
| [0004](0004-pwa-frontend.md) | Mobile-First PWA over Native | Accepted | 2026-10-04 |
| [0005](0005-hipaa-compliance.md) | HIPAA Compliance Strategy | Accepted | 2026-10-04 |
| [0006](0006-tech-stack.md) | TypeScript Full Stack (Fastify + React) | Accepted | 2026-10-04 |
| [0007](0007-deployment-pipeline.md) | Container-First Deployment (Terraform + GH Actions) | Accepted | 2026-10-04 |

## Process

1. **Propose**: Create new ADR with `Proposed` status
2. **Discuss**: Review with team (CEO, CMO, UX Designer) — async via comments
3. **Decide**: Update to `Accepted` or `Rejected`
4. **Implement**: Reference ADR in implementation tasks
5. **Supersede**: If decision changes, create new ADR linking to old

## Template

Use [adr-template.md](../../../.claude/skills/architecture-designer--ead7e945a8/references/adr-template.md) for new ADRs.

## Naming Convention

```
NNNN-short-kebab-case-title.md
```

Where `NNNN` is zero-padded sequential number.