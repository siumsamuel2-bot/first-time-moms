interface RateLimitConfig {
  interval: number;
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export function rateLimit(config: RateLimitConfig) {
  const store: RateLimitStore = {};

  return {
    check: (identifier: string) => {
      const now = Date.now();
      const record = store[identifier];

      if (!record || now > record.resetTime) {
        store[identifier] = {
          count: 1,
          resetTime: now + config.interval,
        };
        return { allowed: true, remaining: config.maxRequests - 1 };
      }

      if (record.count >= config.maxRequests) {
        return { allowed: false, remaining: 0 };
      }

      record.count++;
      return { allowed: true, remaining: config.maxRequests - record.count };
    },
  };
}
