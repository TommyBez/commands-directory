import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { notes } from '@/db/schema/notes'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const commandId = request.nextUrl.searchParams.get('commandId')

    if (!commandId) {
      // Get all notes for user
      const userNotes = await db.query.notes.findMany({
        where: eq(notes.userId, userId),
        with: {
          command: true,
        },
        orderBy: (table, { desc }) => [desc(table.updatedAt)],
      })

      return NextResponse.json({ data: userNotes })
    }

    // Get notes for specific command
    const commandNotes = await db.query.notes.findMany({
      where: and(eq(notes.userId, userId), eq(notes.commandId, commandId)),
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    })

    return NextResponse.json({ data: commandNotes })
  } catch (error) {
    logger.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { commandId, content } = await request.json()

    if (!(commandId && content)) {
      return NextResponse.json(
        { error: 'commandId and content are required' },
        { status: 400 },
      )
    }

    const note = await db
      .insert(notes)
      .values({ userId, commandId, content })
      .returning()

    return NextResponse.json({ data: note[0] }, { status: 201 })
  } catch (error) {
    logger.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, content } = await request.json()

    if (!(id && content)) {
      return NextResponse.json(
        { error: 'id and content are required' },
        { status: 400 },
      )
    }

    const note = await db
      .update(notes)
      .set({ content, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning()

    if (!note[0]) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ data: note[0] })
  } catch (error) {
    logger.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 },
    )
  }
}
