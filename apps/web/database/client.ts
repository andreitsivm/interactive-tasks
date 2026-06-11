import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from './schema/auth';
import * as subscriptionsSchema from './schema/subscriptions';
import { dataBaseUrl } from '@/drizzle.config';

const client = postgres(dataBaseUrl);

export const db = drizzle(client, {
  schema: { ...authSchema, ...subscriptionsSchema },
});
