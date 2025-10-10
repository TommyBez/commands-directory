import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const userRoles = pgEnum('user_roles', ['user', 'admin'])

export const userProfiles = pgTable('user_profiles', {
  userId: text('user_id').primaryKey(),
  onboardingDismissedAt: timestamp('onboarding_dismissed_at'),
  role: userRoles('role').notNull().default('user'), // 'user' | 'admin'
})

export type UserRole = (typeof userRoles.enumValues)[number]
export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
