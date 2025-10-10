import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { commands } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");
    const format = searchParams.get("format") || "json";

    // Build where clause (similar to main commands endpoint)
    const conditions = [];

    if (q) {
      conditions.push(
        or(
          ilike(commands.title, `%${q}%`),
          ilike(commands.description, `%${q}%`),
          ilike(commands.content, `%${q}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? or(...conditions) : undefined;

    const results = await db.query.commands.findMany({
      where: whereClause,
      with: {
        category: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
      limit: 1000, // Max export limit
    });

    if (format === "csv") {
      // Convert to CSV
      const headers = ["Title", "Description", "Content", "Category", "Tags"];
      const rows = results.map((cmd) => [
        cmd.title,
        cmd.description || "",
        cmd.content,
        cmd.category?.name || "",
        cmd.tags.map((t) => t.tag.name).join(", "),
      ]);

      const csv = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=commands.csv",
        },
      });
    }

    // Default to JSON
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Error exporting commands:", error);
    return NextResponse.json(
      { error: "Failed to export commands" },
      { status: 500 },
    );
  }
}
