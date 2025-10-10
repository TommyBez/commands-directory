import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { OnboardingModal } from "@/components/onboarding-modal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookmarkIcon, SearchIcon, ZapIcon } from "lucide-react";
import { db } from "@/db";

export default async function Home() {
  const featuredCategories = await db.query.categories.findMany({
    limit: 4,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingModal />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Master Your Workflow with
                <br />
                <span className="text-primary">Keyboard Commands</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover, search, and learn keyboard-driven commands to boost
                your productivity. Find the perfect shortcut for every task.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Suspense
                  fallback={
                    <div className="w-full max-w-2xl h-12 bg-muted animate-pulse rounded-md" />
                  }
                >
                  <SearchBar />
                </Suspense>
                <p className="text-sm text-muted-foreground">
                  Try searching for commands like "code review" or "onboarding"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <SearchIcon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Quick Search</CardTitle>
                <CardDescription>
                  Find commands instantly with our powerful search and filtering
                  system
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BookmarkIcon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Save Favorites</CardTitle>
                <CardDescription>
                  Bookmark frequently used commands and add personal notes
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <ZapIcon className="h-8 w-8 mb-2 text-primary" />
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
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-3xl font-bold mb-8 text-center">
                Browse by Category
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/commands?category=${category.slug}`}
                  >
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
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
              <div className="text-center mt-8">
                <Button asChild size="lg">
                  <Link href="/commands">View All Commands</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Cursor Commands Explorer. Built with Next.js and Drizzle.
          </p>
        </div>
      </footer>
    </div>
  );
}
