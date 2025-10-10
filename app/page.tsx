import { BookmarkIcon, SearchIcon, ZapIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { OnboardingModal } from '@/components/onboarding-modal'
import { SearchBar } from '@/components/search-bar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/db'

export default async function Home() {
  const featuredCategories = await db.query.categories.findMany({
    limit: 4,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <OnboardingModal />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl space-y-8 text-center">
              <h2 className="font-bold text-4xl tracking-tight md:text-6xl">
                Master Your Workflow with
                <br />
                <span className="text-primary">Keyboard Commands</span>
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
                Discover, search, and learn keyboard-driven commands to boost
                your productivity. Find the perfect shortcut for every task.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Suspense
                  fallback={
                    <div className="h-12 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
                  }
                >
                  <SearchBar />
                </Suspense>
                <p className="text-muted-foreground text-sm">
                  Try searching for commands like "code review" or "onboarding"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <SearchIcon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Quick Search</CardTitle>
                <CardDescription>
                  Find commands instantly with our powerful search and filtering
                  system
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BookmarkIcon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Save Favorites</CardTitle>
                <CardDescription>
                  Bookmark frequently used commands and add personal notes
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <ZapIcon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Learn Fast</CardTitle>
                <CardDescription>
                  Browse by category and tags to find reusable commands for your
                  workflow
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <h3 className="mb-8 text-center font-bold text-3xl">
                Browse by Category
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredCategories.map((category) => (
                  <Link
                    href={`/commands?category=${category.slug}`}
                    key={category.id}
                  >
                    <Card className="h-full cursor-pointer transition-colors hover:border-primary/50">
                      <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button asChild size="lg">
                  <Link href="/commands">View All Commands</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            © 2025 Cursor Commands Explorer. Built with Next.js and Drizzle.
          </p>
        </div>
      </footer>
    </div>
  )
}
