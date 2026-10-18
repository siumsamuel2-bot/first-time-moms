import argon2 from 'argon2';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { config } from '../config.js';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function generateTokens(app: FastifyInstance, user: { id: string; role: string }) {
  const accessToken = app.jwt.sign(
    { sub: user.id, id: user.id, role: user.role },
    { expiresIn: config.JWT_ACCESS_TTL }
  );
  const refreshToken = app.jwt.sign(
    { sub: user.id, id: user.id, role: user.role },
    { expiresIn: config.JWT_REFRESH_TTL }
  );
  return { accessToken, refreshToken };
}

export function setTokenCookies(reply: FastifyReply, accessToken: string, refreshToken: string) {
  const isProd = config.NODE_ENV === 'production';
  reply.setCookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearTokenCookies(reply: FastifyReply) {
  reply.clearCookie('accessToken', { path: '/' });
  reply.clearCookie('refreshToken', { path: '/' });
}
