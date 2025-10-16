import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { checkAdminAccess, getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<'/api/admin/commands/[id]/reject'>,
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
    const body = await request.json()
    const { reason } = body

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
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedByUserId: profile.id,
        rejectionReason: reason || null,
      })
      .where(eq(commands.id, id))
      .returning()

    return NextResponse.json({ data: updatedCommand })
  } catch (error) {
    logger.error('Error rejecting command:', error)
    return NextResponse.json(
      { error: 'Failed to reject command' },
      { status: 500 },
    )
  }
}
