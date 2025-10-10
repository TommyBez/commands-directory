import { auth } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reports } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    const { commandId, kind, message } = await request.json()

    if (!(commandId && kind && message)) {
      return NextResponse.json(
        { error: 'commandId, kind, and message are required' },
        { status: 400 },
      )
    }

    const report = await db
      .insert(reports)
      .values({ userId: userId || null, commandId, kind, message })
      .returning()

    return NextResponse.json({ data: report[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()

    // Only allow authenticated users to view reports (for moderation)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allReports = await db.query.reports.findMany({
      with: {
        command: true,
      },
      orderBy: (reports, { desc }) => [desc(reports.createdAt)],
      limit: 100,
    })

    return NextResponse.json({ data: allReports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 },
    )
  }
}
