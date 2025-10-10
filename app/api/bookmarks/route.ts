import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userBookmarks = await db.query.bookmarks.findMany({
			where: eq(bookmarks.userId, userId),
			with: {
				command: {
					with: {
						category: true,
						tags: {
							with: {
								tag: true,
							},
						},
					},
				},
			},
			orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)],
		});

		return NextResponse.json({ data: userBookmarks });
	} catch (error) {
		console.error("Error fetching bookmarks:", error);
		return NextResponse.json(
			{ error: "Failed to fetch bookmarks" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { commandId } = await request.json();

		if (!commandId) {
			return NextResponse.json(
				{ error: "commandId is required" },
				{ status: 400 },
			);
		}

		// Check if bookmark already exists
		const existing = await db.query.bookmarks.findFirst({
			where: and(
				eq(bookmarks.userId, userId),
				eq(bookmarks.commandId, commandId),
			),
		});

		if (existing) {
			return NextResponse.json(
				{ error: "Bookmark already exists" },
				{ status: 409 },
			);
		}

		const bookmark = await db
			.insert(bookmarks)
			.values({ userId, commandId })
			.returning();

		return NextResponse.json({ data: bookmark[0] }, { status: 201 });
	} catch (error) {
		console.error("Error creating bookmark:", error);
		return NextResponse.json(
			{ error: "Failed to create bookmark" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { commandId } = await request.json();

		if (!commandId) {
			return NextResponse.json(
				{ error: "commandId is required" },
				{ status: 400 },
			);
		}

		await db
			.delete(bookmarks)
			.where(
				and(eq(bookmarks.userId, userId), eq(bookmarks.commandId, commandId)),
			);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting bookmark:", error);
		return NextResponse.json(
			{ error: "Failed to delete bookmark" },
			{ status: 500 },
		);
	}
}

