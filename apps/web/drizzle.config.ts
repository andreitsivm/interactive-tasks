import { defineConfig } from 'drizzle-kit';

const isRailway = process.env.RAILWAY_PROJECT_ID;
export const dataBaseUrl = isRailway
  ? process.env.DATABASE_URL!
  : process.env.DATABASE_PUBLIC_URL!;

export default defineConfig({
  schema: './database/schema/*.ts',
  out: './database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dataBaseUrl,
  },
});
