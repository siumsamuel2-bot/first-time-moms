import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './auth.js';

describe('auth utilities', () => {
  it('hashes and verifies password correctly', async () => {
    const password = 'testPassword123!';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('rejects incorrect password', async () => {
    const password = 'testPassword123!';
    const wrongPassword = 'wrongPassword123!';
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  it('generates different hashes for same password', async () => {
    const password = 'testPassword123!';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);

    const isValid1 = await verifyPassword(password, hash1);
    const isValid2 = await verifyPassword(password, hash2);
    expect(isValid1).toBe(true);
    expect(isValid2).toBe(true);
  });
});
