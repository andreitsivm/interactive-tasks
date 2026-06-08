import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const subscriptions = pgTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  paddleSubscriptionId: text("paddle_subscription_id").unique().notNull(),
  paddleCustomerId: text("paddle_customer_id").notNull(),
  plan: text("plan").$type<"trial" | "pro" | "expired">().notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("current_period_start", { mode: "date" }),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .$defaultFn(() => new Date())
    .notNull(),
});
