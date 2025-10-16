import { auth } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reports } from '@/db/schema/reports'
import { getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    const profile = clerkId ? await getUserProfile(clerkId) : null

    const { commandId, kind, message } = await request.json()

    if (!(commandId && kind && message)) {
      return NextResponse.json(
        { error: 'commandId, kind, and message are required' },
        { status: 400 },
      )
    }

    const report = await db
      .insert(reports)
      .values({ userId: profile?.id || null, commandId, kind, message })
      .returning()

    return NextResponse.json({ data: report[0] }, { status: 201 })
  } catch (error) {
    logger.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth()

    // Only allow authenticated users to view reports (for moderation)
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allReports = await db.query.reports.findMany({
      with: {
        command: true,
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      limit: 100,
    })

    return NextResponse.json({ data: allReports })
  } catch (error) {
    logger.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 },
    )
  }
}
