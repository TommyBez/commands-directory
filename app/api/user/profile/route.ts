import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { onboardingDismissed } = await request.json();

    // Check if profile exists
    const existing = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    });

    if (existing) {
      // Update existing profile
      await db
        .update(userProfiles)
        .set({
          onboardingDismissedAt: onboardingDismissed ? new Date() : null,
        })
        .where(eq(userProfiles.userId, userId));
    } else {
      // Create new profile
      await db.insert(userProfiles).values({
        userId,
        onboardingDismissedAt: onboardingDismissed ? new Date() : null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
