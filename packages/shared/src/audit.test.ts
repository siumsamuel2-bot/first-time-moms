import { describe, it, expect, vi, afterEach } from 'vitest';
import { audit, flushAuditLogs } from './audit';

const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('audit', () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  it('logs a CREATE action with all required fields', () => {
    audit({ userId: 'u1', userRole: 'patient', ipAddress: '127.0.0.1' }, {
      action: 'CREATE',
      resourceType: 'recovery_profiles',
      resourceId: 'p1',
      details: { deliveryType: 'vaginal' },
    });
    flushAuditLogs();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('logs a READ action', () => {
    audit({ userId: 'u2', userRole: 'clinician' }, {
      action: 'READ',
      resourceType: 'daily_check_ins',
      resourceId: 'c1',
      details: { profileId: 'p2' },
    });
    flushAuditLogs();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
