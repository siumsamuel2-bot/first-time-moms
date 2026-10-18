import webPush from 'web-push';
import { prisma } from '../utils/prisma.js';

const VAPID_PUBLIC_KEY = process.env.PUSH_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.PUSH_VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.PUSH_VAPID_SUBJECT ?? 'mailto:admin@firstweeks.app';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function savePushSubscription(userId: string, subscription: PushSubscriptionData) {
  await prisma.pushSubscription.upsert({
    where: { userId_endpoint: { userId, endpoint: subscription.endpoint } },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    update: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
}

export async function deletePushSubscription(userId: string, endpoint: string) {
  await prisma.pushSubscription.deleteMany({
    where: { userId, endpoint },
  });
}

export async function sendPushNotification(
  userId: string,
  payload: { title: string; body: string; url?: string; icon?: string }
) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('VAPID keys not configured, skipping push notification');
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon ?? '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    url: payload.url ?? '/check-in',
    data: { url: payload.url ?? '/check-in' },
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        notificationPayload
      )
    )
  );

  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length > 0) {
    console.error(`${failed.length} push notifications failed`);
    failed.forEach((r, i) => {
      if (r.status === 'rejected' && r.reason?.statusCode === 410) {
        deletePushSubscription(userId, subscriptions[i].endpoint);
      }
    });
  }

  return { sent: results.length - failed.length, failed: failed.length };
}

export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY ?? '';
}
