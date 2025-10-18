import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { logger } from '@/lib/logger'

const JSON_POSTFIX_REGEX = /\.json$/


/**
 * GET /api/registry/[slug]
 * Returns a shadcn registry item JSON for a specific command
 * Following the registry spec from https://ui.shadcn.com/schema/registry-item.json
 */
export async function GET(_request: NextRequest, context: RouteContext<'/registry/[slug]'>) {
  try {
    const { slug } = await context.params

    // Remove .json postfix from slug if present
    const cleanSlug = slug.replace(JSON_POSTFIX_REGEX, '')

    // Fetch the command from the database
    const command = await db.query.commands.findFirst({
      where: eq(commands.slug, cleanSlug),
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

    // Determine categories (tags as categories for filtering)
    let categories: string[] = []
    if (command.tags.length > 0) {
      categories = command.tags.map((t) => t.tag.slug)
    } else if (command.category) {
      categories = [command.category.slug]
    }

    // Build dependencies array if available
    const dependencies: string[] = []
    const registryDependencies: string[] = []

    // Build the registry item according to shadcn schema
    const registryItem = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: command.slug,
      type: 'registry:file' as const,
      title: command.title,
      description: command.description || undefined,
      dependencies,
      registryDependencies,
      files: [
        {
          path: `registry/default/${command.category?.slug || 'commands'}/${command.slug}.md`,
          content: command.content,
          type: 'registry:file' as const,
          target: `~/.cursor/commands/${command.slug}.md`,
        },
      ],
      // Add categories for filtering
      ...(categories.length > 0 && { categories }),
      // Add metadata
      meta: {
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
