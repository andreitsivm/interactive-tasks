import Redis from 'ioredis';

declare global {
  var redis: Redis | undefined;
}

export const redis =
  globalThis.redis ??
  new Redis(process.env.REDIS_PUBLIC_URL!, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.redis = redis;
}
