# Firstweeks Staging Infrastructure (Oracle Cloud Always Free)

Terraform config for the staging environment. Originally written for AWS; rewritten
for **Oracle Cloud Always Free** per board decision on 2026-09-30 (no AWS budget,
see [FIR-23](/FIR/issues/FIR-23)).

## What this provisions

| Resource        | OCI Service              | Always Free limit used              |
| --------------- | ------------------------ | ----------------------------------- |
| Network         | VCN + Internet Gateway   | unlimited (free)                    |
| App tier        | Compute VM.Standard.A1.Flex (Ampere ARM, Oracle Linux 9, Podman) | 4 OCPUs / 24 GB total (default: 2 × 2 OCPU / 12 GB) |
| Database        | Autonomous Database (ATP, free tier) | 1 OCPU / 20 GB, 1 DB of 2 allowed |
| Load balancer   | Flexible LB              | 10 Mbps fixed (free)                |
| Assets          | Object Storage bucket    | 20 GB                               |
| Terraform state | Object Storage backend   | negligible                          |

## Prerequisites (board / human with OCI console access)

1. **Sign up for Oracle Cloud Always Free**: https://www.oracle.com/cloud/free/
   - Requires phone + credit card for identity verification (no charge).
2. **Note the tenancy OCID**: Console → Profile → Tenancy → `ocid1.tenancy.oc1...`
3. **Create a compartment**: Console → Identity & Security → Compartments → `staging`
4. **Create an API signing key**: Console → Profile → API Keys → Add Key → Generate Key Pair
   - Download the private key (never share/commit it) and note the fingerprint.
5. **Send the CTO**: tenancy OCID, compartment OCID, user OCID, fingerprint, region
   (e.g. `us-ashburn-1`), and the private key via secure channel.

## CTO apply procedure

```bash
# 1. Configure credentials (choose one)
export OCI_CLI_TENANCY=ocid1.tenancy.oc1...
export OCI_CLI_USER=ocid1.user.oc1...
export OCI_CLI_FINGERPRINT="aa:bb:..."
export OCI_CLI_KEY_FILE=~/.oci/oci_api_key.pem
export OCI_CLI_REGION=us-ashburn-1

# 2. Create the state bucket manually (state backend bootstrap)
oci os bucket create --compartment-id $compartment_ocid --name firstweeks-terraform-state

# 3. Init with remote backend
cd infra/terraform
cp backend.hcl.example backend.hcl   # fill in namespace + region
terraform init -backend-config=backend.hcl

# 4. Plan and apply
cp terraform.tfvars.example terraform.tfvars   # fill in real values
terraform plan
terraform apply
```

## Post-apply

1. Note `load_balancer_ip` output.
2. Point `api.staging.firstweeks.app` DNS at the LB IP (Route53 or OCI DNS).
3. TLS: add a cert via OCI Certificates or terminate TLS at the app once certbot
   is wired up (free Let's Encrypt).
4. Smoke test: `curl http://api.staging.firstweeks.app/healthz`

## Known limitations

- **No HIPAA BAA on OCI free tier.** Staging only — do not load real PHI. Pilot
  data handling must go through the compliance workstream before production.
- A1.Flex capacity in popular home regions can be intermittently unavailable —
  pick the AD the account is homed in and retry if `Out of capacity`.
- OCI backend has no state locking — single-applier discipline (CTO only).
- Autonomous DB free tier has a private-endpoint-only connection model; app
  connects using the wallet downloaded from the console.

## Layout

```
infra/terraform/
├── main.tf               # root module wiring
├── providers.tf          # OCI provider auth
├── variables.tf
├── outputs.tf
├── backend.hcl.example   # remote state config
├── terraform.tfvars.example
├── modules/
│   ├── network/          # VCN, IGW, subnet, route table, security lists
│   ├── compute/          # A1.Flex instances + cloud-init (Podman)
│   ├── database/         # Autonomous DB free tier
│   ├── loadbalancer/     # Flexible LB, backend set, listener
│   └── storage/          # Object Storage bucket
└── README.md
```
