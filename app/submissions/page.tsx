import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'

export const metadata: Metadata = {
  title: 'My Submissions',
  description:
    "Track the status of Cursor commands you've submitted to the community.",
  openGraph: {
    title: 'My Submissions - Cursor Commands Explorer',
    description:
      "Track the status of Cursor commands you've submitted to the community.",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SubmissionsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
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
    <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-2xl sm:text-3xl">My Submissions</h1>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
              Track the status of commands you've submitted
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/commands/new">
              <span className="hidden sm:inline">Submit New Command</span>
              <span className="sm:hidden">New Command</span>
            </Link>
          </Button>
        </div>

        {userCommands.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-muted-foreground text-sm sm:text-base">
                You haven't submitted any commands yet.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/commands/new">Submit Your First Command</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {userCommands.map((command) => (
              <Card key={command.id}>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg sm:text-xl">
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
                      <Button
                        asChild
                        className="w-full sm:w-auto"
                        size="sm"
                        variant="outline"
                      >
                        <Link href={`/commands/${command.slug}`}>View</Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 font-medium text-sm">Command:</p>
                      <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-xs sm:text-sm">
                        {command.content}
                      </pre>
                    </div>

                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
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
                            {new Date(command.reviewedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {command.rejectionReason && (
                      <div className="rounded-md bg-destructive/10 p-3">
                        <p className="font-medium text-sm">Rejection Reason:</p>
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
  )
}
