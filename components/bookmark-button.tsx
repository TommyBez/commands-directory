"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  commandId: string;
  initialBookmarked?: boolean;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export function BookmarkButton({
  commandId,
  initialBookmarked = false,
  variant = "ghost",
  size = "icon",
  showText = false,
}: BookmarkButtonProps) {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to bookmark commands");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken();
      const method = isBookmarked ? "DELETE" : "POST";

      const response = await fetch("/api/bookmarks", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commandId }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409 && !isBookmarked) {
          // Already bookmarked
          setIsBookmarked(true);
          toast.info("Command is already in your favorites");
          return;
        }
        throw new Error(data.error || "Failed to update bookmark");
      }

      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Removed from favorites" : "Added to favorites",
      );

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={isBookmarked ? "text-red-500 hover:text-red-600" : ""}
      aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""} ${showText ? "mr-2" : ""}`}
      />
      {showText && (
        <span>
          {isBookmarked ? "Remove from favorites" : "Add to favorites"}
        </span>
      )}
    </Button>
  );
}
