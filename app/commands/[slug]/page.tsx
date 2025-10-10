import { FlagIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookmarkButton } from '@/components/bookmark-button'
import { CommandCard } from '@/components/command-card'
import { CopyCommandButton } from '@/components/copy-command-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CommandDetailPage({ params }: PageProps) {
  const { slug } = await params

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/commands/${slug}`,
    { cache: 'no-store' },
  )

  if (!response.ok) {
    notFound()
  }

  const { data: command, related } = await response.json()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Breadcrumb */}
          <div className="text-muted-foreground text-sm">
            <Link className="hover:text-foreground" href="/commands">
              Commands
            </Link>
            {' / '}
            <span className="text-foreground">{command.title}</span>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-4 font-bold text-4xl">{command.title}</h1>
                {command.description && (
                  <p className="text-muted-foreground text-xl">
                    {command.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <BookmarkButton
                  commandId={command.id}
                  initialBookmarked={command.isBookmarked}
                  showText={true}
                  size="default"
                  variant="outline"
                />
                <CopyCommandButton content={command.content} />
              </div>
            </div>

            {/* Command Content */}
            <Card>
              <CardHeader>
                <CardTitle>Command Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4">
                    {command.content}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              {command.category && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Category:</span>
                  <Badge variant="secondary">{command.category.name}</Badge>
                </div>
              )}
              {command.tags && command.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm">Tags:</span>
                  {command.tags.map(
                    (tagRel: { tag: { name: string; slug: string } }) => (
                      <Badge key={tagRel.tag.slug} variant="outline">
                        {tagRel.tag.name}
                      </Badge>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1" variant="outline">
                <FlagIcon className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </div>

            {/* Related Commands */}
            {related && related.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="font-bold text-2xl">Related Commands</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {related
                      .slice(0, 4)
                      .map((cmd: { id: string; isBookmarked?: boolean }) => (
                        <CommandCard
                          command={cmd}
                          isBookmarked={cmd.isBookmarked}
                          key={cmd.id}
                        />
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
