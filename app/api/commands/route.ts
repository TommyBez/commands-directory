import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { commands, categories, commandTags, commandTagMap, bookmarks } from "@/db/schema";
import { eq, ilike, or, and, inArray, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
	try {
		const { userId } = await auth();
		const searchParams = request.nextUrl.searchParams;
		const q = searchParams.get("q");
		const category = searchParams.get("category");
		const tag = searchParams.get("tag");
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "20");
		const offset = (page - 1) * limit;

		// Build where clause
		const conditions = [];

		// Text search across title, description, and content
		if (q) {
			conditions.push(
				or(
					ilike(commands.title, `%${q}%`),
					ilike(commands.description, `%${q}%`),
					ilike(commands.content, `%${q}%`),
				),
			);
		}

		// Category filter
		if (category) {
			const cat = await db.query.categories.findFirst({
				where: eq(categories.slug, category),
			});
			if (cat) {
				conditions.push(eq(commands.categoryId, cat.id));
			}
		}

		// Tag filter
		if (tag) {
			const tagRecord = await db.query.commandTags.findFirst({
				where: eq(commandTags.slug, tag),
			});
			if (tagRecord) {
				const commandIds = await db
					.select({ commandId: commandTagMap.commandId })
					.from(commandTagMap)
					.where(eq(commandTagMap.tagId, tagRecord.id));

				if (commandIds.length > 0) {
					conditions.push(
						inArray(
							commands.id,
							commandIds.map((c) => c.commandId),
						),
					);
				}
			}
		}

		// Execute query
		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const [results, totalCount] = await Promise.all([
			db.query.commands.findMany({
				where: whereClause,
				limit,
				offset,
				with: {
					category: true,
					tags: {
						with: {
							tag: true,
						},
					},
				},
				orderBy: (commands, { desc }) => [desc(commands.createdAt)],
			}),
			db
				.select({ count: sql<number>`count(*)` })
				.from(commands)
				.where(whereClause)
				.then((res) => Number(res[0]?.count || 0)),
		]);

		// Get bookmarked command IDs if user is authenticated
		let bookmarkedCommandIds: string[] = [];
		if (userId) {
			const userBookmarks = await db
				.select({ commandId: bookmarks.commandId })
				.from(bookmarks)
				.where(eq(bookmarks.userId, userId));
			bookmarkedCommandIds = userBookmarks.map((b) => b.commandId);
		}

		// Add isBookmarked flag to each command
		const commandsWithBookmarks = results.map((command) => ({
			...command,
			isBookmarked: bookmarkedCommandIds.includes(command.id),
		}));

		return NextResponse.json({
			data: commandsWithBookmarks,
			pagination: {
				page,
				limit,
				total: totalCount,
				totalPages: Math.ceil(totalCount / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching commands:", error);
		return NextResponse.json(
			{ error: "Failed to fetch commands" },
			{ status: 500 },
		);
	}
}

