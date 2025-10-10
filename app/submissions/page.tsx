import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Command } from '@/db/schema/commands'

type CommandWithRelations = Command & {
  category: {
    id: string
    name: string
    slug: string
    description: string | null
  } | null
  tags: Array<{
    tag: { id: string; name: string; slug: string }
  }>
}

export default async function SubmissionsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/commands`,
    {
      cache: 'no-store',
      headers: {
        Cookie: await import('next/headers')
          .then((mod) => mod.cookies())
          .then((c) => c.toString()),
      },
    },
  )

  const { data: commands } = (await response.json()) as {
    data: CommandWithRelations[]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl">My Submissions</h1>
              <p className="mt-2 text-muted-foreground">
                Track the status of commands you've submitted
              </p>
            </div>
            <Button asChild>
              <Link href="/commands/new">Submit New Command</Link>
            </Button>
          </div>

          {commands.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't submitted any commands yet.
                </p>
                <Button asChild>
                  <Link href="/commands/new">Submit Your First Command</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {commands.map((command) => (
                <Card key={command.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">
                            {command.title}
                          </CardTitle>
                          <Badge variant={getStatusColor(command.status)}>
                            {command.status}
                          </Badge>
                        </div>
                        {command.description && (
                          <p className="mt-2 text-muted-foreground text-sm">
                            {command.description}
                          </p>
                        )}
                      </div>
                      {command.status === 'approved' && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/commands/${command.slug}`}>View</Link>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="mb-1 font-medium text-sm">Command:</p>
                        <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-sm">
                          {command.content}
                        </pre>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {command.category && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Category:
                            </span>
                            <Badge variant="secondary">
                              {command.category.name}
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Submitted:
                          </span>
                          <span>
                            {new Date(command.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {command.reviewedAt && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Reviewed:
                            </span>
                            <span>
                              {new Date(
                                command.reviewedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {command.rejectionReason && (
                        <div className="rounded-md bg-destructive/10 p-3">
                          <p className="font-medium text-sm">
                            Rejection Reason:
                          </p>
                          <p className="mt-1 text-sm">
                            {command.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
