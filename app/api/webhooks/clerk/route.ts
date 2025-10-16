import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { db } from '@/db'
import { userProfiles } from '@/db/schema/user-profiles'
import { logger } from '@/lib/logger'

/**
 * Clerk Webhook Handler
 *
 * Handles user.created and user.updated events from Clerk to sync user profiles.
 *
 * Configuration:
 * 1. Set CLERK_WEBHOOK_SIGNING_SECRET in your environment variables
 * 2. Configure webhook endpoint in Clerk Dashboard: /api/webhooks/clerk
 * 3. Subscribe to: user.created, user.updated events
 */
export async function POST(request: NextRequest) {
  logger.info('Clerk webhook received')
  logger.dir(request, { depth: null })
  try {
    const event = await verifyWebhook(request)
    logger.info('Clerk webhook verified')
    logger.dir(event, { depth: null })

    const { type, data } = event
    if (type === 'user.created' || type === 'user.updated') {
      const clerkId: string = data.id
      const username: string | null = data.username ?? null
      const primaryEmailId = data.primary_email_address_id
      const email: string | null =
        (data.email_addresses || []).find(
          (e: { id: string; email_address: string }) => e.id === primaryEmailId,
        )?.email_address ?? null

      const existing = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.clerkId, clerkId),
      })

      if (existing) {
        await db
          .update(userProfiles)
          .set({ email, username })
          .where(eq(userProfiles.id, existing.id))
        logger.info(`Updated user profile for clerkId: ${clerkId}`)
      } else {
        await db.insert(userProfiles).values({ clerkId, email, username })
        logger.info(`Created user profile for clerkId: ${clerkId}`)
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    logger.error('Webhook verification or processing failed:', error)
    return new Response(JSON.stringify({ error: 'Invalid webhook' }), {
      status: 400,
    })
  }
}
