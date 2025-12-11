import { ArrowRightIcon, BookmarkIcon, SearchIcon, ZapIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { McpModal } from '@/components/mcp-modal'
import { SearchBar } from '@/components/search-bar'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RetroGrid } from '@/components/ui/retro-grid'
import { db } from '@/db'

const DELAY_FACTOR = 0.1

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

async function getFeaturedCategories() {
  return await db.query.categories.findMany({
    limit: 4,
  })
}

export default async function Home() {
  const featuredCategories = await getFeaturedCategories()

  return (
    <main className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background py-12 sm:py-24 md:py-32">
        <RetroGrid />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <BlurFade delay={0.2} inView>
              <div className="group mx-auto mb-6 flex w-fit items-center justify-center rounded-full border border-black/5 bg-neutral-100/80 px-4 py-1.5 backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/80">
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  <span className="mr-2">✨</span> The #1 Collection of Cursor
                  Commands
                  <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </div>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <h1 className="font-bold text-4xl leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Copy-ready Cursor commands, <br className="hidden sm:block" />
                shared by the community
              </h1>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
                Discover proven commands snippets for Cursor's agent—search,
                preview, and paste in seconds to speed up your next task.
              </p>
            </BlurFade>

            <BlurFade delay={0.5} inView>
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <Suspense
                  fallback={
                    <div className="h-14 w-full max-w-2xl animate-pulse rounded-full bg-muted shadow-sm" />
                  }
                >
                  <div className="w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01]">
                    <SearchBar />
                  </div>
                </Suspense>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <McpModal />
                  <p className="font-medium text-muted-foreground text-sm">
                    Install via MCP to use commands directly in your IDE
                  </p>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <BlurFade delay={0.2} inView>
            <Card className="relative h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SearchIcon className="h-6 w-6" />
                </div>
                <CardTitle className="font-bold text-xl">
                  Curated by real Cursor power users
                </CardTitle>
                <CardDescription className="text-base">
                  Commands are hand-picked and tested by experienced Cursor
                  users who know what works.
                </CardDescription>
              </CardHeader>
              <BorderBeam delay={9} duration={12} size={250} />
            </Card>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <Card className="relative h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookmarkIcon className="h-6 w-6" />
                </div>
                <CardTitle className="font-bold text-xl">
                  One-click copy with usage examples
                </CardTitle>
                <CardDescription className="text-base">
                  Copy commands instantly with detailed usage instructions and
                  real-world examples.
                </CardDescription>
              </CardHeader>
              <BorderBeam delay={6} duration={12} size={250} />
            </Card>
          </BlurFade>

          <BlurFade delay={0.6} inView>
            <Card className="relative h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-md sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ZapIcon className="h-6 w-6" />
                </div>
                <CardTitle className="font-bold text-xl">
                  Tags for stack, framework, and goal
                </CardTitle>
                <CardDescription className="text-base">
                  Find exactly what you need with smart tags for your tech
                  stack, framework, and specific goals.
                </CardDescription>
              </CardHeader>
              <BorderBeam delay={3} duration={12} size={250} />
            </Card>
          </BlurFade>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-t bg-muted/30 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <BlurFade delay={0.2} inView>
              <h3 className="mb-8 text-center font-bold text-3xl tracking-tight sm:mb-12 sm:text-4xl">
                Browse by Category
              </h3>
            </BlurFade>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {featuredCategories.map((category, index) => (
                <BlurFade delay={DELAY_FACTOR * index} inView key={category.id}>
                  <Link
                    className="group block h-full"
                    href={`/commands?category=${category.slug}`}
                  >
                    <Card className="hover:-translate-y-1 h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                      <CardHeader className="p-6">
                        <CardTitle className="font-semibold text-lg tracking-tight group-hover:text-primary">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </BlurFade>
              ))}
            </div>
            <BlurFade delay={0.4} inView>
              <div className="mt-10 text-center sm:mt-16">
                <Button
                  asChild
                  className="h-12 w-full px-8 font-medium text-base shadow-lg transition-all hover:shadow-xl sm:w-auto"
                  size="lg"
                >
                  <Link href="/commands">
                    View All Commands{' '}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>
    </main>
  )
}
