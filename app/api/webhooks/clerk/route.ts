import type { WebhookEvent } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { db } from '@/db'
import { userProfiles } from '@/db/schema/user-profiles'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!WEBHOOK_SECRET) {
    logger.error('Missing CLERK_WEBHOOK_SIGNING_SECRET')
    return new Response('Server configuration error', { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!(svixId && svixTimestamp && svixSignature)) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.text()

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    logger.error('Webhook verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  const { type, data } = evt

  if (type === 'user.created' || type === 'user.updated') {
    const clerkId: string = data.id
    const username: string | null = data.username ?? null

    const primaryEmailId: string | undefined = data.primary_email_address_id
    const email: string | null =
      (data.email_addresses || []).find((e) => e.id === primaryEmailId)
        ?.email_address ?? null

    try {
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
    } catch (error) {
      logger.error('Error upserting user profile:', error)
      return new Response('Database error', { status: 500 })
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
