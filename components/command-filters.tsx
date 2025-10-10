"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export function CommandFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleFilterChange = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value && value !== "all") {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		params.delete("page"); // Reset to first page
		router.push(`/commands?${params.toString()}`);
	};

	const clearFilters = () => {
		const params = new URLSearchParams();
		const q = searchParams.get("q");
		if (q) params.set("q", q);
		router.push(`/commands?${params.toString()}`);
	};

	const hasFilters =
		searchParams.has("category") ||
		searchParams.has("tag");

	return (
		<div className="flex flex-wrap gap-4 items-end">
			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium">Category</span>
				<Select
					value={searchParams.get("category") || "all"}
					onValueChange={(value) => handleFilterChange("category", value)}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						<SelectItem value="development-workflow">Development Workflow</SelectItem>
						<SelectItem value="code-quality">Code Quality</SelectItem>
						<SelectItem value="testing">Testing</SelectItem>
						<SelectItem value="project-setup">Project Setup</SelectItem>
						<SelectItem value="team-collaboration">Team Collaboration</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium">Tag</span>
				<Select
					value={searchParams.get("tag") || "all"}
					onValueChange={(value) => handleFilterChange("tag", value)}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="All Tags" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Tags</SelectItem>
						<SelectItem value="git">Git</SelectItem>
						<SelectItem value="review">Review</SelectItem>
						<SelectItem value="testing">Testing</SelectItem>
						<SelectItem value="security">Security</SelectItem>
						<SelectItem value="setup">Setup</SelectItem>
						<SelectItem value="documentation">Documentation</SelectItem>
						<SelectItem value="onboarding">Onboarding</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{hasFilters && (
				<Button variant="outline" size="sm" onClick={clearFilters}>
					<XIcon className="h-4 w-4 mr-2" />
					Clear Filters
				</Button>
			)}
		</div>
	);
}

