import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'

export default function AdminCommandsLoading() {
  return (
    <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <div>
          <Skeleton className="h-8 w-56 sm:h-9 sm:w-64" />
          <Skeleton className="mt-2 h-5 w-64 sm:w-80" />
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </TabsList>

          <TabsContent className="space-y-3 sm:space-y-4" value="pending">
            {Array.from({ length: 3 }, (_, i) => `command-${i}`).map((key) => (
              <Card key={key}>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4 sm:h-7 sm:w-80" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="mb-1 h-4 w-20" />
                      <Skeleton className="h-24 w-full rounded-md" />
                    </div>

                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                      <Skeleton className="h-10 w-full sm:w-24" />
                      <Skeleton className="h-10 w-full sm:w-24" />
                      <Skeleton className="h-10 w-full sm:w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
