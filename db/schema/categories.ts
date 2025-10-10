import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { commands } from './commands'

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  commands: many(commands),
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
