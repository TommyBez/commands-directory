import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { commandTagMap } from './command-tags'
import { userProfiles } from './user-profiles'

export const commands = pgTable('commands', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'rejected'
  submittedByUserId: uuid('submitted_by_user_id').references(
    () => userProfiles.id,
    { onDelete: 'set null' },
  ),
  reviewedAt: timestamp('reviewed_at'),
  reviewedByUserId: uuid('reviewed_by_user_id').references(
    () => userProfiles.id,
    { onDelete: 'set null' },
  ),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const commandsRelations = relations(commands, ({ one, many }) => ({
  category: one(categories, {
    fields: [commands.categoryId],
    references: [categories.id],
  }),
  tags: many(commandTagMap),
}))

export type CommandStatus = 'pending' | 'approved' | 'rejected'
export type Command = typeof commands.$inferSelect
export type NewCommand = typeof commands.$inferInsert
