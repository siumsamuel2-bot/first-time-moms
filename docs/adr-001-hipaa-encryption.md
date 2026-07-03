# ADR-001: HIPAA Encryption at Rest

## Status
Accepted

## Context
As a postpartum support platform handling sensitive PHI (Protected Health Information), Firstweeks must comply with HIPAA Security Rule §164.312(a)(2)(iv), which requires encryption of ePHI at rest.

## Decision
We will use AES-256-GCM for encrypting PHI fields at rest. The master key will be stored in the `MASTER_ENCRYPTION_KEY` environment variable as a base64-encoded 32-byte value.

## Rationale
- AES-256 is a NIST-approved algorithm for protecting sensitive data.
- GCM mode provides both confidentiality and integrity (authentication).
- Environment-variable key storage is simple and avoids checking secrets into source control.
- The `crypto` module's `createCipheriv` and `createDecipheriv` are available in Node.js without additional dependencies.

## Consequences
- All PHI fields must be encrypted before storage and decrypted after retrieval.
- Adding encryption will slightly increase CPU usage and storage size (due to IV and auth tag overhead).
- The master key must be rotated periodically. A 32-byte base64 string is required.
- We cannot use full-text search on encrypted fields without additional indexing strategies.

## Conformance
- PHI fields are encrypted using the provided utility functions (`encryptPHI`, `decryptPHI`, `ensureEncrypted`).
- Audit logging tracks access to encrypted fields.
- De-identification pipeline strips identifiers before research use.
