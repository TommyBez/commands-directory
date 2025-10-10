import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { commands } from './commands'

export const commandTags = pgTable('command_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

export const commandTagMap = pgTable(
  'command_tag_map',
  {
    commandId: uuid('command_id')
      .notNull()
      .references(() => commands.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => commandTags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.commandId, table.tagId] }),
  }),
)

export const commandTagsRelations = relations(commandTags, ({ many }) => ({
  commands: many(commandTagMap),
}))

export const commandTagMapRelations = relations(commandTagMap, ({ one }) => ({
  command: one(commands, {
    fields: [commandTagMap.commandId],
    references: [commands.id],
  }),
  tag: one(commandTags, {
    fields: [commandTagMap.tagId],
    references: [commandTags.id],
  }),
}))

export type CommandTag = typeof commandTags.$inferSelect
export type NewCommandTag = typeof commandTags.$inferInsert
