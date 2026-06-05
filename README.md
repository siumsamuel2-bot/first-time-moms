# Firstweeks

Personalized postpartum recovery support for first-time mothers.

## Tech Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Web**: Next.js 14 (App Router)
- **Database**: PostgreSQL 16 with Drizzle ORM
- **AI**: Weighted rule engine + OpenAI GPT-4
- **Mobile**: React Native (Expo) — planned
- **Auth**: NextAuth.js v5
- **CI/CD**: GitHub Actions
- **Infra**: Docker Compose → AWS ECS Fargate / Terraform

## Getting Started
```bash
docker compose up -d
npm install
npm run dev
```

## Project Structure
```
apps/web          # Next.js app with API routes
packages/db       # Drizzle schema + migrations
packages/shared   # Shared types + onboarding state machine
packages/ai       # Triage classifier
infra/            # Terraform config
```