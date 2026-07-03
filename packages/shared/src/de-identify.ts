/**
 * De-identification pipeline for research dataset generation.
 * Removes or obfuscates the 18 HIPAA identifiers so the output
 * can be used for analytics and model training.
 *
 * HIPAA-safe identifiers to remove / generalize:
 * 1. Names                 2. Geographic data (smaller than state)
 * 3. Dates (except year)   4. Phone / Fax
 * 5. Email                 6. SSN
 * 7. Medical record #      8. Health plan beneficiary #
 * 9. Account #            10. Certificate / license #
 * 11. Vehicle ID #        12. Device ID / serial #
 * 13. Web URL             14. IP address
 * 15. Biometric ID        16. Full-face photo / comparable image
 * 17. Any other unique identifier
 * 18. Any other information that could be used to identify the individual
 */ type RecordWithData = Record<string, unknown>;

export interface DeidentifyConfig {
  removeNames: boolean;
  generalizeDates: boolean;
  generalizeGeography: boolean;
  removeIds: boolean;
  shiftDays: number; // random shift within +/- N days to preserve relative ordering
}

export const defaultDeidentifyConfig: DeidentifyConfig = {
  removeNames: true,
  generalizeDates: true,
  generalizeGeography: true,
  removeIds: true,
  shiftDays: 0,
};

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0] ?? '';
}

export function deidentifyRecord(
  record: RecordWithData,
  config: DeidentifyConfig = defaultDeidentifyConfig,
): RecordWithData {
  const out: RecordWithData = { ...record };

  // 1. Names
  if (config.removeNames) {
    delete out['name'];
    delete out['firstName'];
    delete out['lastName'];
    delete out['fullName'];
    delete out['patientName'];
    delete out['providerName'];
    delete out['motherName'];
  }

  // 2. Geographic data
  if (config.generalizeGeography) {
    if (out['zip'] && typeof out['zip'] === 'string') {
      // truncate to first 3 digits (safe for most regions)
      out['zip'] = out['zip'].toString().slice(0, 3) + 'xx';
    }
    delete out['address'];
    delete out['street'];
    delete out['city'];
  }

  // 3. Dates
  if (config.generalizeDates) {
    const dateKeys = ['deliveryDate', 'checkInDate', 'createdAt', 'updatedAt', 'triggeredAt', 'dataConsentGrantedAt'];
    for (const key of dateKeys) {
      if (out[key] && typeof out[key] === 'string') {
        out[key] = out[key].slice(0, 4); // keep year only
      }
    }
  }

  // 4-16. Remove known identifiers
  if (config.removeIds) {
    const idKeys = [
      'userId', 'patientId', 'ssn', 'medicalRecordNumber',
      'healthPlanNumber', 'accountNumber', 'licenseNumber',
      'vehicleId', 'deviceSerial', 'email', 'phone', 'fax',
      'ipAddress', 'biometricId', 'photoUrl', 'webUrl',
    ];
    for (const key of idKeys) {
      delete out[key];
    }
  }

  // 17. Shift dates if needed (preserve relative ordering)
  if (config.shiftDays !== 0) {
    const dateKeys = Object.keys(out).filter((k) => out[k] && typeof out[k] === 'string' && /\d{4}-\d{2}-\d{2}/.test(out[k] as string));
    for (const key of dateKeys) {
      out[key] = shiftDate(out[key] as string, config.shiftDays);
    }
  }

  return out;
}

export function deidentifyDataset(records: RecordWithData[], config?: DeidentifyConfig): RecordWithData[] {
  return records.map((r) => deidentifyRecord(r, config));
}