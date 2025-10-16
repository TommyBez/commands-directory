import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getUserProfile(clerkId)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const userCommands = await db.query.commands.findMany({
      where: eq(commands.submittedByUserId, profile.id),
      with: {
        category: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    })

    return NextResponse.json({ data: userCommands })
  } catch (error) {
    logger.error('Error fetching user commands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user commands' },
      { status: 500 },
    )
  }
}
