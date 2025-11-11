import { eq } from 'drizzle-orm'
import { unstable_noStore } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { logger } from '@/lib/logger'

function resolveBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    'http://localhost:3000'
  )
}

function createEmptyRegistry(baseUrl: string) {
  return {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'cursor-commands',
    homepage: baseUrl,
    items: [] as unknown[],
  }
}

function isPrerenderingCacheError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const maybeError = error as Error & {
    cause?: unknown
    digest?: string
  }

  const message = maybeError.message ?? ''
  if (
    message.includes('During prerendering') ||
    message.includes('NEXT_PRERENDER_INTERRUPTED') ||
    message.includes('HANGING_PROMISE_REJECTION')
  ) {
    return true
  }

  if (typeof maybeError.digest === 'string') {
    const digest = maybeError.digest
    if (digest.includes('HANGING_PROMISE_REJECTION')) {
      return true
    }
  }

  if (maybeError.cause) {
    return isPrerenderingCacheError(maybeError.cause)
  }

  return false
}

/**
 * GET /api/registry
 * Returns the complete registry following the registry.json schema
 * Following the registry spec from https://ui.shadcn.com/schema/registry.json
 */
export async function GET(_request: NextRequest) {
  unstable_noStore()
  const baseUrl = resolveBaseUrl()

  try {
    // Fetch all approved commands with their relationships
    const approvedCommands = await db.query.commands.findMany({
      where: eq(commands.status, 'approved'),
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

    // Transform commands into full registry items following registry-item.json schema
    const registryItems = approvedCommands.map((command) => {
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

      return {
        name: command.slug,
        type: 'registry:file' as const,
        title: command.title,
        description: command.description || undefined,
        dependencies,
        registryDependencies,
        files: [
          {
            path: `registry/default/${command.category?.slug || 'commands'}/${command.slug}.md`,
            type: 'registry:file' as const,
            target: `~/.cursor/commands/${command.slug}.md`,
          },
        ],
        ...(categories.length > 0 && { categories }),
        meta: {
          categoryName: command.category?.name,
          tags: command.tags.map((t) => ({
            name: t.tag.name,
            slug: t.tag.slug,
          })),
          createdAt: command.createdAt.toISOString(),
          updatedAt: command.updatedAt.toISOString(),
        },
        docs: command.description
          ? `# ${command.title}\n\n${command.description}\n\n## Installation\n\nThis command will be installed to \`.cursor/commands/${command.slug}.md\``
          : undefined,
      }
    })

    const registry = {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'cursor-commands',
      homepage: baseUrl,
      items: registryItems,
    }

    return NextResponse.json(registry, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    if (isPrerenderingCacheError(error)) {
      logger.debug(
        'Registry generation skipped during prerender; returning empty dataset.',
      )
      return NextResponse.json(createEmptyRegistry(baseUrl), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      })
    }

    logger.error('Error fetching registry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registry' },
      { status: 500 },
    )
  }
}
