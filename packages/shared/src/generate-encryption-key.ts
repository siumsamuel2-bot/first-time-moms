/**
 * Generate a new random master encryption key and print it.
 * Run once, store in your secret manager (e.g., AWS Secrets Manager),
 * then set as MASTER_ENCRYPTION_KEY in your environment.
 */
import { randomBytes } from 'crypto';

const key = randomBytes(32).toString('base64');
console.log(key);
