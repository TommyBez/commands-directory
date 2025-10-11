import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { logger } from '@/lib/logger'

type RouteContext = {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/registry/[slug]
 * Returns a shadcn registry item JSON for a specific command
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params

    // Fetch the command from the database
    const command = await db.query.commands.findFirst({
      where: eq(commands.slug, slug),
      with: {
        category: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    })

    // Only return approved commands in the registry
    if (!command || command.status !== 'approved') {
      return NextResponse.json(
        { error: 'Registry item not found' },
        { status: 404 },
      )
    }

    // Get the base URL for file references
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      'http://localhost:3000'

    // Build the registry item according to shadcn schema
    const registryItem = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: command.slug,
      type: 'registry:file' as const,
      title: command.title,
      description: command.description || undefined,
      files: [
        {
          path: `${baseUrl}/api/registry/files/${command.slug}`,
          type: 'registry:file' as const,
          target: `.cursor/commands/${command.slug}.md`,
        },
      ],
      // Add categories as metadata
      categories: command.category
        ? [command.category.slug]
        : command.tags.length > 0
          ? command.tags.map((t) => t.tag.slug)
          : undefined,
      // Add metadata
      meta: {
        commandId: command.id,
        categoryName: command.category?.name,
        tags: command.tags.map((t) => ({
          name: t.tag.name,
          slug: t.tag.slug,
        })),
        createdAt: command.createdAt.toISOString(),
        updatedAt: command.updatedAt.toISOString(),
      },
      // Add docs if available
      docs: command.description
        ? `# ${command.title}\n\n${command.description}\n\n## Installation\n\nThis command will be installed to \`.cursor/commands/${command.slug}.md\``
        : undefined,
    }

    return NextResponse.json(registryItem, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    logger.error('Error fetching registry item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registry item' },
      { status: 500 },
    )
  }
}
