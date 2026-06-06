import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema/auth.ts",
  out: "./database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
