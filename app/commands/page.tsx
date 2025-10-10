import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { CommandFilters } from "@/components/command-filters";
import { CommandCard } from "@/components/command-card";
import type { Command } from "@/db/schema";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

type CommandWithRelations = Command & {
  category?: { name: string; slug: string } | null;
  tags?: Array<{ tag: { name: string; slug: string } }>;
  isBookmarked?: boolean;
};

export default async function CommandsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/commands?${queryString}`,
    { cache: "no-store" },
  );

  const { data: commands, pagination } = (await response.json()) as {
    data: CommandWithRelations[];
    pagination: { total: number; page: number; totalPages: number };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Search Commands</h2>
            <SearchBar />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <CommandFilters />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {pagination.total} command
                {pagination.total !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>

            {commands.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No commands found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {commands.map((command) => (
                  <CommandCard
                    key={command.id}
                    command={command}
                    isBookmarked={command.isBookmarked}
                  />
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                {pagination.page > 1 && (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/commands?${new URLSearchParams({ ...params, page: String(pagination.page - 1) }).toString()}`}
                    >
                      Previous
                    </Link>
                  </Button>
                )}
                {pagination.page < pagination.totalPages && (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/commands?${new URLSearchParams({ ...params, page: String(pagination.page + 1) }).toString()}`}
                    >
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
