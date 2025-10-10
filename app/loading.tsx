import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl space-y-8 text-center">
              <div className="space-y-4">
                <Skeleton className="mx-auto h-16 w-3/4" />
                <Skeleton className="mx-auto h-16 w-2/3" />
              </div>
              <Skeleton className="mx-auto h-6 w-2/3" />
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-full max-w-2xl" />
                <Skeleton className="h-4 w-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => `feature-${i}`).map((key) => (
              <Card key={key}>
                <CardHeader>
                  <Skeleton className="mb-2 h-8 w-8" />
                  <Skeleton className="mb-2 h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <Skeleton className="mx-auto mb-8 h-9 w-64" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => `category-${i}`).map(
                  (key) => (
                    <Card key={key}>
                      <CardHeader>
                        <Skeleton className="mb-2 h-6 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardHeader>
                    </Card>
                  ),
                )}
              </div>
              <div className="mt-8 text-center">
                <Skeleton className="mx-auto h-11 w-48" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="mx-auto h-4 w-96" />
        </div>
      </footer>
    </div>
  )
}
