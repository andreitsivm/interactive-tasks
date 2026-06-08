ALTER TABLE "users" ALTER COLUMN "subscription_plan" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_plan" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "trial_tokens_used" integer DEFAULT 0 NOT NULL;