"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") || "");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams);
		if (query) {
			params.set("q", query);
		} else {
			params.delete("q");
		}
		router.push(`/commands?${params.toString()}`);
	};

	return (
		<form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl">
			<div className="relative flex-1">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search commands..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-10"
				/>
			</div>
			<Button type="submit">Search</Button>
		</form>
	);
}

