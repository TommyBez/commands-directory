import { ModerationActions } from '@/components/moderation-actions'
import { Badge } from '@/components/ui/badge'
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

type CommandModerationCardProps = {
  command: CommandWithRelations
}

export function CommandModerationCard({ command }: CommandModerationCardProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl">
              {command.title}
            </CardTitle>
            {command.description && (
              <p className="mt-2 text-muted-foreground text-sm">
                {command.description}
              </p>
            )}
          </div>
          <Badge>{command.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <p className="mb-1 font-medium text-sm">Command:</p>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-xs sm:text-sm">
              {command.content}
            </pre>
          </div>

          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {command.category && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="secondary">{command.category.name}</Badge>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Submitted:</span>
              <span>{new Date(command.createdAt).toLocaleDateString()}</span>
            </div>
            {command.reviewedAt && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Reviewed:</span>
                <span>{new Date(command.reviewedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {command.rejectionReason && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="font-medium text-sm">Rejection Reason:</p>
              <p className="mt-1 text-sm">{command.rejectionReason}</p>
            </div>
          )}

          <ModerationActions
            commandId={command.id}
            currentStatus={command.status}
          />
        </div>
      </CardContent>
    </Card>
  )
}
