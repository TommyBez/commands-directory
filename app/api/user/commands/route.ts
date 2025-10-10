import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userCommands = await db.query.commands.findMany({
      where: eq(commands.submittedByUserId, userId),
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
