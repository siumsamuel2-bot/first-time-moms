import { describe, it, expect } from 'vitest';
import { encryptPHI, decryptPHI, ensureEncrypted } from './encryption';

const TEST_KEY = 'V/0xIZFKVqCLsrmNZVTvnavrdgR4Df28duMA36ORFOA=';

describe('encryption', () => {
  it('round-trips a simple string', async () => {
    process.env.MASTER_ENCRYPTION_KEY = TEST_KEY;
    const original = 'sensitive-phi-value';
    const encrypted = await encryptPHI(original);
    expect(encrypted).not.toBe(original);
    expect(encrypted.startsWith('ENC:')).toBe(true);
    const decrypted = await decryptPHI(encrypted);
    expect(decrypted).toBe(original);
  });

  it('is idempotent: double-encrypt is a no-op second time', async () => {
    process.env.MASTER_ENCRYPTION_KEY = TEST_KEY;
    const original = 'phi';
    const encrypted = await encryptPHI(original);
    const second = await encryptPHI(encrypted);
    expect(second).toBe(encrypted);
  });

  it('ensureEncrypted handles null/undefined', async () => {
    expect(await ensureEncrypted(null)).toBe(null);
    expect(await ensureEncrypted(undefined)).toBe(null);
  });

  it('decrypts already encrypted value as-is', async () => {
    process.env.MASTER_ENCRYPTION_KEY = TEST_KEY;
    const encrypted = await encryptPHI('x');
    expect(await ensureEncrypted(encrypted)).toBe(encrypted);
  });
});
