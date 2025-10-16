import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { checkAdminAccess, getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function PATCH(
  _request: NextRequest,
  { params }: RouteContext<'/api/admin/commands/[id]/approve'>,
) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkAdminAccess(clerkId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const profile = await getUserProfile(clerkId)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
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
        reviewedByUserId: profile.id,
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
