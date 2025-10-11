import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { checkAdminAccess } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<'/api/admin/commands/[id]'>,
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

    // Delete the command
    await db.delete(commands).where(eq(commands.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting command:', error)
    return NextResponse.json(
      { error: 'Failed to delete command' },
      { status: 500 },
    )
  }
}
