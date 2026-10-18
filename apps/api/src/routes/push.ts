import { Role } from '@firstweeks/shared';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import {
  deletePushSubscription,
  getVapidPublicKey,
  savePushSubscription,
  sendPushNotification,
} from '../services/push-notifications.js';

const PushSubscriptionInput = Type.Object({
  endpoint: Type.String({ format: 'uri' }),
  keys: Type.Object({
    p256dh: Type.String(),
    auth: Type.String(),
  }),
});

const PushSubscriptionResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    publicKey: Type.String(),
  }),
});

const PushSendResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    sent: Type.Integer(),
    failed: Type.Integer(),
  }),
});

type PushSubscriptionBody = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function pushRoutes(app: FastifyInstance) {
  app.get(
    '/push/public-key',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: PushSubscriptionResponse } },
    },
    async () => {
      return { success: true, data: { publicKey: getVapidPublicKey() } };
    }
  );

  app.post<{ Body: PushSubscriptionBody }>(
    '/push/subscribe',
    {
      preHandler: [authenticate()],
      schema: { body: PushSubscriptionInput, response: { 201: PushSubscriptionResponse } },
    },
    async (request: FastifyRequest<{ Body: PushSubscriptionBody }>, reply: FastifyReply) => {
      const user = request.user as { id: string };
      await savePushSubscription(user.id, request.body);
      return reply.code(201).send({ success: true, data: { publicKey: getVapidPublicKey() } });
    }
  );

  app.delete<{ Body: { endpoint: string } }>(
    '/push/unsubscribe',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: Type.Object({ success: Type.Boolean() }) } },
    },
    async (request: FastifyRequest<{ Body: { endpoint: string } }>) => {
      const user = request.user as { id: string };
      await deletePushSubscription(user.id, request.body.endpoint);
      return { success: true };
    }
  );

  app.post(
    '/push/test',
    {
      preHandler: [
        authenticate(),
        (request: FastifyRequest) => {
          const user = request.user as { role: string };
          if (user.role !== Role.ADMIN) {
            throw new Error('Admin only');
          }
        },
      ],
      schema: { response: { 200: PushSendResponse } },
    },
    async (request: FastifyRequest) => {
      const user = request.user as { id: string };
      const result = await sendPushNotification(user.id, {
        title: 'Test Notification',
        body: 'Push notifications are working!',
        url: '/check-in',
      });
      return { success: true, data: { sent: result?.sent ?? 0, failed: result?.failed ?? 0 } };
    }
  );

  app.post(
    '/push/test-daily-reminder',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: PushSendResponse } },
    },
    async (request: FastifyRequest) => {
      const user = request.user as { id: string };
      const result = await sendDailyCheckInReminder(user.id);
      return { success: true, data: { sent: result?.sent ?? 0, failed: result?.failed ?? 0 } };
    }
  );
}

export async function sendDailyCheckInReminder(userId: string) {
  return sendPushNotification(userId, {
    title: 'Daily Check-in Reminder',
    body: 'Take a moment to check in on your recovery today.',
    url: '/check-in',
  });
}

export async function sendEscalationAlert(userId: string, trigger: string) {
  return sendPushNotification(userId, {
    title: 'Care Team Alert',
    body: `Your care team has been notified about ${trigger.replace(/_/g, ' ').toLowerCase()}.`,
    url: '/dashboard',
  });
}
