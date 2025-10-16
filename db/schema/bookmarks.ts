import { relations } from 'drizzle-orm'
import { pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { commands } from './commands'
import { userProfiles } from './user-profiles'

export const bookmarks = pgTable(
  'bookmarks',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => userProfiles.id, { onDelete: 'cascade' }),
    commandId: uuid('command_id')
      .notNull()
      .references(() => commands.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniq: unique().on(table.userId, table.commandId),
  }),
)

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  command: one(commands, {
    fields: [bookmarks.commandId],
    references: [commands.id],
  }),
}))

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
