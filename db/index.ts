import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { bookmarks, bookmarksRelations } from './schema/bookmarks'
import { categories, categoriesRelations } from './schema/categories'
import {
  commandTagMap,
  commandTagMapRelations,
  commandTags,
  commandTagsRelations,
} from './schema/command-tags'
import { commands, commandsRelations } from './schema/commands'
import { notes, notesRelations } from './schema/notes'
import {
  reportKindEnum,
  reportStatusEnum,
  reports,
  reportsRelations,
} from './schema/reports'
import { userProfiles } from './schema/user-profiles'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = neon(databaseUrl)
export const db = drizzle(sql, {
  schema: {
    bookmarks,
    bookmarksRelations,
    categories,
    categoriesRelations,
    commandTags,
    commandTagMap,
    commandTagsRelations,
    commandTagMapRelations,
    commands,
    commandsRelations,
    notes,
    notesRelations,
    reportKindEnum,
    reportStatusEnum,
    reports,
    reportsRelations,
    userProfiles,
  },
})
