import { BookmarkIcon, SearchIcon, ZapIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { SearchBar } from '@/components/search-bar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/db'

export const metadata: Metadata = {
  title: 'Home',
  description:
    "Copy-ready Cursor commands, shared by the community. Discover proven command snippets for Cursor's agent—search, preview, and paste in seconds.",
  openGraph: {
    title: 'Cursor Commands Explorer - Home',
    description:
      "Copy-ready Cursor commands, shared by the community. Discover proven command snippets for Cursor's agent—search, preview, and paste in seconds.",
  },
}

export default async function Home() {
  const featuredCategories = await db.query.categories.findMany({
    limit: 4,
  })

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6 text-center sm:space-y-8">
            <h2 className="font-bold text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Copy-ready Cursor commands, shared by the community
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Discover proven commands snippets for Cursor's agent—search,
              preview, and paste in seconds to speed up your next task.
            </p>
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <Suspense
                fallback={
                  <div className="h-12 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
                }
              >
                <SearchBar />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <SearchIcon className="mb-2 h-6 w-6 text-primary sm:h-8 sm:w-8" />
              <CardTitle className="text-lg sm:text-xl">
                Curated by real Cursor power users
              </CardTitle>
              <CardDescription className="text-sm">
                Commands are hand-picked and tested by experienced Cursor users
                who know what works
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BookmarkIcon className="mb-2 h-6 w-6 text-primary sm:h-8 sm:w-8" />
              <CardTitle className="text-lg sm:text-xl">
                One-click copy with usage notes & examples
              </CardTitle>
              <CardDescription className="text-sm">
                Copy commands instantly with detailed usage instructions and
                real-world examples
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="sm:col-span-2 md:col-span-1">
            <CardHeader>
              <ZapIcon className="mb-2 h-6 w-6 text-primary sm:h-8 sm:w-8" />
              <CardTitle className="text-lg sm:text-xl">
                Tags for stack, framework, and goal
              </CardTitle>
              <CardDescription className="text-sm">
                Find exactly what you need with smart tags for your tech stack,
                framework, and specific goals
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h3 className="mb-6 text-center font-bold text-2xl sm:mb-8 sm:text-3xl">
              Browse by Category
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {featuredCategories.map((category) => (
                <Link
                  href={`/commands?category=${category.slug}`}
                  key={category.id}
                >
                  <Card className="h-full cursor-pointer transition-colors hover:border-primary/50">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center sm:mt-8">
              <Button asChild className="w-full sm:w-auto" size="lg">
                <Link href="/commands">View All Commands</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
