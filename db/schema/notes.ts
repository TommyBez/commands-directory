import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { commands } from "./commands";

export const notes = pgTable("notes", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("user_id").notNull(),
	commandId: uuid("command_id")
		.notNull()
		.references(() => commands.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notesRelations = relations(notes, ({ one }) => ({
	command: one(commands, {
		fields: [notes.commandId],
		references: [commands.id],
	}),
}));

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

