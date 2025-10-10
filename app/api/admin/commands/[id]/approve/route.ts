import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { userProfiles } from '@/db/schema/user-profiles'
import { logger } from '@/lib/logger'

async function checkAdminAccess(userId: string | null): Promise<boolean> {
  if (!userId) {
    return false
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  })

  return profile?.role === 'admin'
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkAdminAccess(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    // Check if command exists
    const command = await db.query.commands.findFirst({
      where: eq(commands.id, id),
    })

    if (!command) {
      return NextResponse.json({ error: 'Command not found' }, { status: 404 })
    }

    // Update command status
    const [updatedCommand] = await db
      .update(commands)
      .set({
        status: 'approved',
        reviewedAt: new Date(),
        reviewedByUserId: userId,
        rejectionReason: null,
      })
      .where(eq(commands.id, id))
      .returning()

    return NextResponse.json({ data: updatedCommand })
  } catch (error) {
    logger.error('Error approving command:', error)
    return NextResponse.json(
      { error: 'Failed to approve command' },
      { status: 500 },
    )
  }
}
