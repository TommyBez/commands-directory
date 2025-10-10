import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Load environment variables
if (typeof window === 'undefined') {
  dotenv.config({ path: '.env.local' })
}

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = neon(databaseUrl)
export const db = drizzle(sql, { schema })
