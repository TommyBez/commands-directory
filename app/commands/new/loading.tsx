import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <div>
          <Skeleton className="h-8 w-64 sm:h-9 sm:w-80" />
          <Skeleton className="mt-2 h-4 w-full max-w-2xl sm:h-5" />
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <Skeleton className="h-6 w-40 sm:h-7 sm:w-48" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1 sm:flex-initial sm:w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
