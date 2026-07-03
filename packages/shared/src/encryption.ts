/**
 * Encryption utilities for PHI at-rest protection.
 * Uses AES-256-GCM with a master key derived from a composite key.
 * All PHI > encrypted field type must flow through these functions.
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_PREFIX = 'ENC:';

function getMasterKey(): Buffer {
  const raw = process.env.MASTER_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) {
    throw new Error('MASTER_ENCRYPTION_KEY must be set and ≥ 32 chars');
  }
  return Buffer.from(raw, 'base64');
}

function generateIv(): Buffer {
  return randomBytes(12);
}

/**
 * Encrypt plaintext PHI. Returns base64 payload with embedded IV.
 */
export async function encryptPHI(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext;
  if (plaintext.startsWith(ENCRYPTION_PREFIX)) return plaintext; // already encrypted
  const key = getMasterKey();
  const iv = generateIv();
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, encrypted, authTag]);
  return ENCRYPTION_PREFIX + payload.toString('base64');
}

/**
 * Decrypt a previously encrypted PHI payload.
 */
export async function decryptPHI(ciphertext: string): Promise<string> {
  if (!ciphertext || !ciphertext.startsWith(ENCRYPTION_PREFIX)) return ciphertext;
  const key = getMasterKey();
  const payload = Buffer.from(ciphertext.slice(ENCRYPTION_PREFIX.length), 'base64');
  const iv = payload.subarray(0, 12);
  const encrypted = payload.subarray(12, -16);
  const authTag = payload.subarray(-16);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

/**
 * Safe wrapper: encrypt if plain, no-op if already encrypted.
 */
export async function ensureEncrypted(value: string | null | undefined): Promise<string | null> {
  if (!value) return value ?? null;
  if (value.startsWith(ENCRYPTION_PREFIX)) return value;
  return encryptPHI(value);
}
