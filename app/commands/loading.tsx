import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CommandsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-7 w-24" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }, (_, i) => `filter-${i}`).map((key) => (
                <Skeleton className="h-10 w-32" key={key} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => `command-card-${i}`).map(
                (key) => (
                  <Card key={key}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <Skeleton className="h-9 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
