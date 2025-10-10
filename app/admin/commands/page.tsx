import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { CommandModerationCard } from '@/components/command-moderation-card'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import type { Command } from '@/db/schema/commands'
import { userProfiles } from '@/db/schema/user-profiles'

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

export default async function AdminCommandsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Check if user is admin
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  })

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const [pendingCommands, approvedCommands, rejectedCommands] = await Promise.all([
    db.query.commands.findMany({
      where: eq(commands.status, 'pending'),
      with: {
        category: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    }),
    db.query.commands.findMany({
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
    }),
    db.query.commands.findMany({
      where: eq(commands.status, 'rejected'),
      with: {
        category: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    }),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="font-bold text-3xl">Command Moderation</h1>
            <p className="mt-2 text-muted-foreground">
              Review and manage submitted commands
            </p>
          </div>

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingCommands.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedCommands.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedCommands.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="pending">
              {pendingCommands.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No pending commands to review.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingCommands.map((command) => (
                  <CommandModerationCard command={command} key={command.id} />
                ))
              )}
            </TabsContent>

            <TabsContent className="space-y-4" value="approved">
              {approvedCommands.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No approved commands.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                approvedCommands.map((command) => (
                  <CommandModerationCard command={command} key={command.id} />
                ))
              )}
            </TabsContent>

            <TabsContent className="space-y-4" value="rejected">
              {rejectedCommands.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No rejected commands.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                rejectedCommands.map((command) => (
                  <CommandModerationCard command={command} key={command.id} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
