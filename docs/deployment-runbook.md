# Deployment Runbook — Firstweeks Staging

Infrastructure: Oracle Cloud Always Free (per board decision 2026-09-30, see
[FIR-23](/FIR/issues/FIR-23)). Terraform code: `infra/terraform/`.

## Phase 1 — Board / human steps (requires OCI console access)

- [ ] Sign up for Oracle Cloud Always Free (https://www.oracle.com/cloud/free/),
      complete phone + card verification (no charge)
- [ ] Note tenancy OCID (Console → Profile → Tenancy)
- [ ] Create compartment `staging` (Console → Identity & Security → Compartments)
- [ ] Create API signing key (Console → Profile → API Keys → Add Key → Generate
      Key Pair); download private key, note fingerprint
- [ ] Deliver to CTO via secure channel: tenancy OCID, compartment OCID, user
      OCID, fingerprint, private key, region
- [ ] Decide DNS home for `api.staging.firstweeks.app` (Route53 or OCI DNS)

## Phase 2 — CTO bootstrap (one heartbeat)

- [ ] Configure OCI credentials as `OCI_CLI_*` environment variables
- [ ] Manually create state bucket: `oci os bucket create --name firstweeks-terraform-state`
- [ ] `terraform init -backend-config=backend.hcl`

## Phase 3 — CTO apply (one heartbeat)

- [ ] Fill `terraform.tfvars` (never commit it)
- [ ] `terraform plan` — review: 2× A1.Flex, 1 ATP DB, 1 flexible LB, VCN, bucket
- [ ] `terraform apply`
- [ ] Record LB public IP output

## Phase 4 — Post-apply wiring

- [ ] Point `api.staging.firstweeks.app` at LB IP
- [ ] TLS cert (OCI Certificates or Let's Encrypt via certbot)
- [ ] Smoke test `curl http://api.staging.firstweeks.app/healthz`
- [ ] Update [FIR-191](/FIR/issues/FIR-191) and [FIR-190](/FIR/issues/FIR-190) to done

## Rollback

- `terraform destroy` tears everything down (state bucket persists).
- No state locking on the OCI backend: never run two applies concurrently.

## Compliance note

- No HIPAA BAA on any cloud free tier. Staging must not contain real PHI.
- Production HIPAA posture is a separate workstream (BAA, encryption at rest,
  audit logging) and gates the pilot.

## Automated apply (CI runner)

The environment blocker (no host with `terraform` + `oci` CLI) is now solved by a
GitHub Actions runner instead of a local shell:

- `terraform validate` runs on every change under `infra/terraform/**`
  (workflow `.github/workflows/terraform.yml`, target
  `infra/terraform/environments/oci-staging`).
- `.github/workflows/terraform-apply.yml` is a manual (`workflow_dispatch`)
  runner that bootstraps the state bucket, `terraform init -backend-config=backend.hcl`,
  plans, and (on `action=apply`) applies the OCI staging stack.

Remaining human prerequisites (configure once in the repo's `staging` environment):

1. Put this repo on GitHub (workflows live here; no remote currently exists).
2. Add the `staging` environment secrets listed at the top of `terraform-apply.yml`.
3. Point `api.staging.firstweeks.app` at the load balancer IP from `terraform output`.

After that, provisioning is one click, zero local tooling.

