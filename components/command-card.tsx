import Link from 'next/link'
import { BookmarkButton } from '@/components/bookmark-button'
import { InstallWithShadcnButton } from '@/components/install-with-shadcn-button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Command } from '@/db/schema/commands'

const CONTENT_PREVIEW_LENGTH = 150
const MAX_TAGS = 3

type CommandCardProps = {
  command: Command & {
    category?: { name: string; slug: string } | null
    tags?: Array<{ tag: { name: string; slug: string } }>
  }
  isBookmarked?: boolean
}

export function CommandCard({
  command,
  isBookmarked = false,
}: CommandCardProps) {
  // Extract a preview from content (first 150 chars)
  const contentPreview = command.content
    ?.replace(/^#.*$/gm, '') // Remove headings
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
    .slice(0, CONTENT_PREVIEW_LENGTH)

  return (
    <Link href={`/commands/${command.slug}`}>
      <Card className="group relative cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
        <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <InstallWithShadcnButton
            showText={false}
            size="icon"
            slug={command.slug}
            variant="outline"
          />
          <BookmarkButton
            commandId={command.id}
            initialBookmarked={isBookmarked}
          />
        </div>
        <CardHeader>
          <CardTitle className="pr-8 text-lg">{command.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {command.description || contentPreview}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {command.category && (
              <Badge className="text-xs" variant="secondary">
                {command.category.name}
              </Badge>
            )}
            {command.tags && command.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {command.tags.slice(0, MAX_TAGS).map((tagRel) => (
                  <Badge
                    className="text-xs"
                    key={tagRel.tag.slug}
                    variant="outline"
                  >
                    {tagRel.tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
