import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { commands } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		const { slug } = await params;

		const command = await db.query.commands.findFirst({
			where: eq(commands.slug, slug),
			with: {
				category: true,
				tags: {
					with: {
						tag: true,
					},
				},
			},
		});

		if (!command) {
			return NextResponse.json({ error: "Command not found" }, { status: 404 });
		}

		// Find related commands (same category or tags)
		const relatedCommands = await db.query.commands.findMany({
			where: eq(commands.categoryId, command.categoryId!),
			limit: 5,
			with: {
				category: true,
				tags: {
					with: {
						tag: true,
					},
				},
			},
		});

		// Filter out the current command
		const related = relatedCommands.filter((c) => c.id !== command.id);

		return NextResponse.json({
			data: command,
			related,
		});
	} catch (error) {
		console.error("Error fetching command:", error);
		return NextResponse.json(
			{ error: "Failed to fetch command" },
			{ status: 500 },
		);
	}
}

