import type { Role as SharedRole } from '@firstweeks/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

export function authenticate() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const publicPaths = [
      '/healthz',
      '/auth/signup',
      '/auth/login',
      '/auth/refresh',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/docs',
    ];
    if (publicPaths.some((p) => request.url.startsWith(p))) return;

    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }
  };
}

export function authorize(...allowedRoles: SharedRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { role: SharedRole } | undefined;
    if (!user || !allowedRoles.includes(user.role)) {
      return reply.code(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }
  };
}

export function optionalAuth() {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      // Ignore - user stays undefined
    }
  };
}
