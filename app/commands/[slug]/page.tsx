import Link from "next/link";
import { notFound } from "next/navigation";
import { FlagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommandCard } from "@/components/command-card";
import { CopyCommandButton } from "@/components/copy-command-button";
import { BookmarkButton } from "@/components/bookmark-button";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function CommandDetailPage({ params }: PageProps) {
	const { slug } = await params;

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/commands/${slug}`,
		{ cache: "no-store" },
	);

	if (!response.ok) {
		notFound();
	}

	const { data: command, related } = await response.json();

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Breadcrumb */}
					<div className="text-sm text-muted-foreground">
						<Link href="/commands" className="hover:text-foreground">
							Commands
						</Link>
						{" / "}
						<span className="text-foreground">{command.title}</span>
					</div>

					{/* Main Content */}
					<div className="space-y-6">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h1 className="text-4xl font-bold mb-4">{command.title}</h1>
								{command.description && (
									<p className="text-xl text-muted-foreground">
										{command.description}
									</p>
								)}
							</div>
							<div className="flex gap-2">
								<BookmarkButton 
									commandId={command.id} 
									initialBookmarked={command.isBookmarked}
									variant="outline" 
									size="default"
									showText={true}
								/>
								<CopyCommandButton content={command.content} />
							</div>
						</div>

						{/* Command Content */}
						<Card>
							<CardHeader>
								<CardTitle>Command Details</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="prose prose-slate dark:prose-invert max-w-none">
									<pre className="whitespace-pre-wrap bg-muted p-4 rounded-md overflow-x-auto">
										{command.content}
									</pre>
								</div>
							</CardContent>
						</Card>

						{/* Metadata */}
						<div className="flex flex-wrap gap-4 items-center">
							{command.category && (
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">Category:</span>
									<Badge variant="secondary">{command.category.name}</Badge>
								</div>
							)}
							{command.tags && command.tags.length > 0 && (
								<div className="flex items-center gap-2 flex-wrap">
									<span className="text-sm font-medium">Tags:</span>
									{command.tags.map((tagRel: { tag: { name: string; slug: string } }) => (
										<Badge key={tagRel.tag.slug} variant="outline">
											{tagRel.tag.name}
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							<Button variant="outline" className="flex-1">
								<FlagIcon className="h-4 w-4 mr-2" />
								Report Issue
							</Button>
						</div>

						{/* Related Commands */}
						{related && related.length > 0 && (
							<>
								<Separator />
								<div className="space-y-4">
									<h2 className="text-2xl font-bold">Related Commands</h2>
									<div className="grid gap-4 md:grid-cols-2">
										{related.slice(0, 4).map((cmd: { id: string; isBookmarked?: boolean }) => (
											<CommandCard 
												key={cmd.id} 
												command={cmd} 
												isBookmarked={cmd.isBookmarked}
											/>
										))}
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

