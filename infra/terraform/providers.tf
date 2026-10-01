provider "oci" {
  # Authentication uses the standard OCI resolution chain:
  #   1. OCI_CLI_* environment variables (recommended for CI)
  #   2. ~/.oci/config profile (DEFAULT or OCI_PROFILE)
  #
  # Required credentials (board-provided, see docs/deployment-runbook.md):
  #   OCI_CLI_TENANCY, OCI_CLI_USER, OCI_CLI_FINGERPRINT,
  #   OCI_CLI_KEY_FILE (or OCI_CLI_KEY_CONTENT), OCI_CLI_REGION
  #
  # Never commit credentials or private keys to this repository.
}
