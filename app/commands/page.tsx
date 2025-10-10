import Link from "next/link";
import { CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { CommandFilters } from "@/components/command-filters";
import { CommandCard } from "@/components/command-card";

interface PageProps {
	searchParams: Promise<{
		q?: string;
		category?: string;
		tag?: string;
		page?: string;
	}>;
}

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
		`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/commands?${queryString}`,
		{ cache: "no-store" },
	);

	const { data: commands, pagination } = await response.json();

	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<CommandIcon className="h-6 w-6" />
						<h1 className="text-xl font-bold">Cursor Commands Explorer</h1>
					</Link>
					<div className="flex gap-2">
						<Button variant="ghost" asChild>
							<Link href="/commands">Browse</Link>
						</Button>
						<Button variant="ghost" asChild>
							<Link href="/favorites">Favorites</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/sign-in">Sign In</Link>
						</Button>
					</div>
				</div>
			</header>

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
								Found {pagination.total} command{pagination.total !== 1 ? "s" : ""}
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
								{commands.map((command: { id: string; isBookmarked?: boolean }) => (
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

