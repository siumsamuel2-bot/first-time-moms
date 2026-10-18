# ADR-002: Use PostgreSQL as Primary Database

## Status
Accepted

## Context
Firstweeks requires a database for:
- User accounts and authentication
- Onboarding quiz responses (structured, relational)
- Daily check-in responses (time-series, linked to users)
- Recovery profiles (JSON, evolving schema)
- Symptom escalation tracking (events, timestamps)
- Provider directory (structured, relationships)
- Clinician dashboard queries (aggregations, filtering)
- De-identified analytics exports (bulk queries)

Requirements:
- ACID compliance for user data integrity
- Complex relational queries (joins across users, check-ins, escalations)
- JSON support for flexible recovery profiles
- Time-series queries for daily check-in trends
- HIPAA-compliant encryption at rest (production)
- Managed service preferred (Oracle Autonomous Database on Always Free)
- Cost-effective for staging and pilot

## Decision
Use **PostgreSQL** (via Oracle Autonomous Database on Always Free tier for staging, dedicated PostgreSQL for production) as the primary database.

Schema organization:
- Single database with schema-per-module (onboarding, checkins, escalation, providers, clinician, analytics)
- Shared `users` table in `public` schema
- JSONB columns for flexible recovery profiles and AI-generated content
- Partitioned tables for daily check-ins (by month) for time-series performance
- Row-level security for clinician data access

## Consequences

### Positive
- ACID transactions for user data and escalation workflows
- Rich JSONB support for flexible recovery profiles
- Excellent time-series performance with partitioning
- Full-text search for provider directory
- Mature tooling, ORMs (Prisma, SQLAlchemy, Drizzle)
- Oracle Autonomous Database free tier (2 databases, 20GB each)
- Strong HIPAA compliance posture (encryption, audit logging available)

### Negative
- Vertical scaling limits (mitigated by read replicas later)
- Operational expertise needed for tuning
- Oracle Autonomous DB has some feature limitations vs self-managed

### Neutral
- Team will use Prisma ORM for type-safe database access
- Migrations managed via Prisma Migrate

## Alternatives Considered

**MySQL**
- Rejected: Weaker JSON support, less sophisticated full-text search, fewer extensions
- Considered: Familiar to team, similar cost

**MongoDB**
- Rejected: Relational data model needed (users ↔ check-ins ↔ escalations ↔ providers), ACID across collections limited
- Considered: Flexible schema for recovery profiles

**TimescaleDB**
- Rejected: Overkill for pilot scale, adds operational complexity
- Considered: Native time-series optimizations

**DynamoDB**
- Rejected: Complex query patterns require denormalization, no SQL, vendor lock-in
- Considered: Serverless scaling

## References
- Database Selection Reference: Relational (PostgreSQL) for ACID + complex queries + JSON
- Oracle Cloud Always Free: 2 Autonomous Databases, 20GB each