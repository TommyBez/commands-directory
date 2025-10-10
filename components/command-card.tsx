import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkButton } from "@/components/bookmark-button";
import type { Command } from "@/db/schema";

interface CommandCardProps {
	command: Command & {
		category?: { name: string; slug: string } | null;
		tags?: Array<{ tag: { name: string; slug: string } }>;
	};
	isBookmarked?: boolean;
}

export function CommandCard({ command, isBookmarked = false }: CommandCardProps) {
	// Extract a preview from content (first 150 chars)
	const contentPreview = command.content
		?.replace(/^#.*$/gm, "") // Remove headings
		.replace(/\n+/g, " ") // Replace newlines with spaces
		.trim()
		.slice(0, 150);

	return (
		<Link href={`/commands/${command.slug}`}>
			<Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer relative group">
				<div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
					<BookmarkButton commandId={command.id} initialBookmarked={isBookmarked} />
				</div>
				<CardHeader>
					<CardTitle className="text-lg pr-8">{command.title}</CardTitle>
					<CardDescription className="line-clamp-2">
						{command.description || contentPreview}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex flex-wrap gap-2 items-center">
						{command.category && (
							<Badge variant="secondary" className="text-xs">
								{command.category.name}
							</Badge>
						)}
						{command.tags && command.tags.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{command.tags.slice(0, 3).map((tagRel) => (
									<Badge key={tagRel.tag.slug} variant="outline" className="text-xs">
										{tagRel.tag.name}
									</Badge>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

