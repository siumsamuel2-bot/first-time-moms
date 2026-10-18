# Incident Response Runbook

## Overview
This runbook defines the procedures for detecting, responding to, and recovering from security and operational incidents affecting the Firstweeks postpartum support application.

## Incident Classification

### Severity Levels
| Level | Definition | Response Time | Examples |
|-------|------------|---------------|----------|
| **SEV-1 (Critical)** | Complete service outage, data breach, or safety issue | Immediate (15 min) | API down, PHI exposure, escalation system failure |
| **SEV-2 (High)** | Major feature degradation, partial outage | 1 hour | Check-in submission failing, provider search down |
| **SEV-3 (Medium)** | Minor feature issue, performance degradation | 4 hours | Slow page loads, intermittent errors |
| **SEV-4 (Low)** | Cosmetic issue, non-critical bug | Next business day | UI alignment, typo |

### Incident Types
1. **Security Incidents**: Unauthorized access, data breach, vulnerability exploitation
2. **Availability Incidents**: Service outage, performance degradation
3. **Data Incidents**: Data loss, corruption, incorrect data
4. **Clinical Safety Incidents**: Escalation failure, incorrect referral, missed alert

## Roles and Responsibilities

### Incident Commander (CTO or designated)
- Overall coordination and decision-making
- Communicate with stakeholders (CEO, CMO, practices)
- Declare incident severity and resolution

### Technical Lead (Engineer on-call)
- Technical investigation and remediation
- Coordinate with team members
- Execute runbook procedures

### Communications Lead (CMO or designated)
- Internal team communication
- External communication (practices, patients if needed)
- Status page updates

### On-Call Schedule
- Primary: CTO
- Secondary: Engineer 1
- Tertiary: Engineer 2
- Escalation: CEO

## Detection and Alerting

### Automated Alerts (Grafana Cloud → PagerDuty)
- API/Web high CPU/memory (>80% for 5min)
- ALB 5xx error rate (>0.1/s for 2min)
- ALB high latency (>1s for 2min)
- RDS high CPU (>80% for 5min)
- RDS low storage (<10GB)
- RDS high connections (>150)
- ECS unhealthy tasks (< desired count)
- WAF blocked requests spike

### Manual Detection
- User reports via support channel
- Clinician dashboard alerts
- Scheduled job failures (daily reminders, analytics export)

## Response Procedures

### Phase 1: Detection & Triage (0-15 minutes)
1. **Acknowledge alert** in PagerDuty
2. **Assess severity** using classification matrix
3. **Notify team** in #incidents Slack channel
4. **Check status page** and update if SEV-1/2
5. **Start incident timeline** document

### Phase 2: Investigation (15-60 minutes)
1. **Check Grafana dashboards** for affected service
2. **Review recent deployments** (GitHub Actions, ECS deployments)
3. **Check CloudWatch logs** for error patterns
4. **Verify database connectivity** and performance
5. **Check external dependencies** (SendGrid, Twilio, push notifications)

### Phase 3: Mitigation (Ongoing)
#### Common Mitigations
- **ECS service unhealthy**: Force new deployment via `aws ecs update-service --force-new-deployment`
- **High CPU/memory**: Scale ECS service desired count
- **Database issues**: Check RDS console, consider failover
- **ALB 5xx errors**: Check target group health, ECS task logs
- **Push notification failures**: Check VAPID keys, web-push service status

#### Rollback Procedure
```bash
# Get previous task definition
aws ecs describe-services --cluster production-firstweeks --services production-firstweeks-api
# Update to previous task definition
aws ecs update-service --cluster production-firstweeks --service production-firstweeks-api --task-definition <previous-arn>
```

### Phase 4: Resolution & Recovery
1. **Verify fix** with health checks and smoke tests
2. **Monitor** for 30 minutes post-fix
3. **Update status page** to resolved
4. **Close PagerDuty incident**
5. **Schedule postmortem** for SEV-1/2

### Phase 5: Postmortem (Within 5 business days)
1. **Create postmortem document** using template
2. **Root cause analysis** (5 Whys)
3. **Action items** with owners and deadlines
4. **Review in team meeting**
5. **Update runbooks** and monitoring

## Communication Templates

### Internal Slack (SEV-1/2)
```
🚨 INCIDENT: [SEV-1/2] - [Brief description]
Status: Investigating
Impact: [What's affected]
Commander: @cto
Technical Lead: @engineer
Timeline: [Link to timeline doc]
```

### Status Page Update
- SEV-1: Immediate
- SEV-2: Within 15 minutes
- SEV-3: Within 1 hour

### Practice Communication (SEV-1 affecting clinical workflows)
- Email to practice leads within 30 minutes
- Phone call for critical clinical safety issues
- Follow-up within 2 hours

## Specific Incident Playbooks

### Playbook 1: API Service Down
1. Check ECS service status: `aws ecs describe-services --cluster production-firstweeks --services production-firstweeks-api`
2. Check ALB target group health
3. Check CloudWatch logs for API container
4. If task failing: Check task definition, secrets, database connectivity
5. Force new deployment if needed
6. Verify `/healthz` endpoint returns 200

### Playbook 2: Database Connectivity Issues
1. Check RDS console for instance status
2. Check security group rules (ECS SG → RDS SG on 5432)
3. Check connection pool exhaustion (max_connections)
4. If Multi-AZ: Initiate failover if primary unhealthy
5. Check for long-running queries: `SELECT * FROM pg_stat_activity WHERE state = 'active';`

### Playbook 3: Escalation System Failure
1. Check scheduler logs in CloudWatch
2. Verify `evaluateEscalation` function logic
3. Check push notification delivery (VAPID keys, web-push)
4. Check for recent deployments affecting escalation logic
5. Manual escalation check via clinician dashboard

### Playbook 4: Data Breach / PHI Exposure
1. **Immediately**: Revoke compromised credentials, rotate secrets
2. **Contain**: Isolate affected systems, disable compromised access
3. **Assess**: Determine scope of PHI exposed (logs, database, exports)
4. **Notify**: Legal counsel, CEO, affected parties per HIPAA breach notification rule
4. **Document**: All actions taken, timeline, scope
5. **Remediate**: Fix root cause, enhance monitoring

### Playbook 5: Push Notification Failures
1. Check web-push library errors in API logs
2. Verify VAPID keys in Secrets Manager
3. Check PushSubscription table for valid endpoints
4. Test with `POST /push/test` endpoint
5. Verify FCM/APNs status (external dependency)

## Runbook Maintenance
- Review quarterly
- Update after each postmortem
- Test procedures during game days
- Version control in Git

## Contact Information
| Role | Name | Phone | Email | Slack |
|------|------|-------|-------|-------|
| CTO | [Name] | [Phone] | [Email] | @cto |
| Engineer 1 | [Name] | [Phone] | [Email] | @eng1 |
| Engineer 2 | [Name] | [Phone] | [Email] | @eng2 |
| CMO | [Name] | [Phone] | [Email] | @cmo |
| CEO | [Name] | [Phone] | [Email] | @ceo |
| AWS Support | - | - | - | Business Support Case |
| Grafana Cloud | - | - | - | Support Portal |

## References
- [AWS Incident Response](https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/welcome.html)
- [HIPAA Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html)
- [NIST SP 800-61 Rev. 2](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)