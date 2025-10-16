import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { userProfiles } from '@/db/schema/user-profiles'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { onboardingDismissed } = await request.json()

    // Check if profile exists (profile should be created via webhook)
    const profile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.clerkId, clerkId),
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Update existing profile
    await db
      .update(userProfiles)
      .set({
        onboardingDismissedAt: onboardingDismissed ? new Date() : null,
      })
      .where(eq(userProfiles.id, profile.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    )
  }
}
