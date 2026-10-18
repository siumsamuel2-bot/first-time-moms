import { cleanup, exportAndUploadAnalytics } from '../services/analytics-export.js';
import { logger } from '../utils/logger.js';

export async function handler(event: unknown): Promise<{ statusCode: number; body: string }> {
  console.log('Analytics export Lambda triggered', { event });

  try {
    const result = await exportAndUploadAnalytics();

    logger.info('Analytics export completed', {
      usersKey: result.usersKey,
      checkInsKey: result.checkInsKey,
      escalationsKey: result.escalationsKey,
      referralsKey: result.referralsKey,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Analytics export completed successfully',
        files: {
          users: result.usersKey,
          checkIns: result.checkInsKey,
          escalations: result.escalationsKey,
          referrals: result.referralsKey,
        },
      }),
    };
  } catch (error) {
    logger.error('Analytics export failed', { error });

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Analytics export failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  } finally {
    await cleanup();
  }
}
