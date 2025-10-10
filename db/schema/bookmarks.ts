import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { commands } from "./commands";

export const bookmarks = pgTable(
	"bookmarks",
	{
		userId: text("user_id").notNull(),
		commandId: uuid("command_id")
			.notNull()
			.references(() => commands.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		uniq: unique().on(table.userId, table.commandId),
	}),
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	command: one(commands, {
		fields: [bookmarks.commandId],
		references: [commands.id],
	}),
}));

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;

