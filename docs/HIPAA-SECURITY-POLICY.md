# HIPAA Security Policy

## 1. Purpose
This policy establishes the requirements for protecting electronic protected health information (ePHI) under the Health Insurance Portability and Accountability Act (HIPAA) Security Rule.

## 2. Encryption at Rest
- **Standard**: AES-256-GCM encryption for all PHI fields.
- **Key Management**: Master key must be at least 32 characters, stored in `MASTER_ENCRYPTION_KEY` environment variable. Rotate keys every 90 days.
- **Implementation**: All sensitive fields (e.g., mental health baseline, check-in responses) must be encrypted before storage.

## 3. Audit Logging
- **Scope**: All access, creation, modification, and deletion of PHI.
- **Requirements**: Capture user ID, action, resource type, resource ID, timestamp, IP address, and user agent.
- **Storage**: Logs are flushed to secure storage (e.g., CloudTrail, Splunk) in production. Console logging is used in development.
- **Retention**: Retain audit logs for 6 years.

## 4. Access Controls
- **Authentication**: All API endpoints require a valid session (NextAuth).
- **Authorization**: Role-based access control (RBAC) for clinicians and patients.
- **De-identification**: A pipeline must remove or hash all 18 HIPAA identifiers before generating research datasets.

## 5. Business Associate Agreement (BAA)
- **Requirement**: A BAA must be signed before engaging any cloud provider or third-party service that handles ePHI.
- **Template**: See `docs/BAA-template.md` for a draft.

## 6. Incident Response
- **Breach Notification**: Notify affected users and the Department of Health and Human Services (HHS) within 60 days of a breach.
- **Investigation**: All breaches must be investigated and documented in the audit logs.

## 7. Training and Compliance
- All team members must complete annual HIPAA training.
- This policy must be reviewed and updated annually.
