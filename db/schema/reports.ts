import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { commands } from "./commands";

export const reportKindEnum = pgEnum("report_kind", [
  "incorrect",
  "outdated",
  "other",
]);
export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "triaged",
  "resolved",
]);

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  commandId: uuid("command_id")
    .notNull()
    .references(() => commands.id, { onDelete: "cascade" }),
  kind: reportKindEnum("kind").notNull(),
  message: text("message").notNull(),
  status: reportStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reportsRelations = relations(reports, ({ one }) => ({
  command: one(commands, {
    fields: [reports.commandId],
    references: [commands.id],
  }),
}));

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
