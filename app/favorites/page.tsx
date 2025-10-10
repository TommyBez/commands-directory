import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { CommandCard } from "@/components/command-card";
import { cookies } from "next/headers";

export default async function FavoritesPage() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in?redirect_url=/favorites");
	}
	const cookieStore = await cookies();
	
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/bookmarks`,
		{
			headers: {
				Cookie: cookieStore.toString(),
			},
			cache: "no-store",
		},
	);

	const { data: bookmarks } = await response.json();

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="max-w-5xl mx-auto space-y-8">
					<div>
						<h1 className="text-3xl font-bold">My Favorites</h1>
						<p className="text-muted-foreground mt-2">
							Commands you've bookmarked for quick access
						</p>
					</div>

					{bookmarks.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground mb-4">
								You haven't bookmarked any commands yet.
							</p>
							<Button asChild>
								<Link href="/commands">Browse Commands</Link>
							</Button>
						</div>
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{bookmarks.map((bookmark: Record<string, never>) => (
								<CommandCard
									key={(bookmark.command as { id: string }).id}
									command={bookmark.command as Parameters<typeof CommandCard>[0]['command']}
									isBookmarked={true}
								/>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

