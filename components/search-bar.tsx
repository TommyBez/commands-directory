"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, FileTextIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from "@/components/ui/command";

type Command = {
	id: string;
	slug: string;
	title: string;
	description: string | null;
	category: {
		name: string;
		slug: string;
	} | null;
};

export function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const [commands, setCommands] = useState<Command[]>([]);
	const [loading, setLoading] = useState(false);

	// Load recent searches from localStorage
	useEffect(() => {
		const stored = localStorage.getItem("recentSearches");
		if (stored) {
			setRecentSearches(JSON.parse(stored));
		}
	}, []);

	// Debounced search function
	const searchCommands = useCallback(async (searchQuery: string) => {
		if (!searchQuery.trim()) {
			setCommands([]);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`/api/commands?q=${encodeURIComponent(searchQuery)}&limit=8`
			);
			const data = await response.json();
			setCommands(data.data || []);
		} catch (error) {
			console.error("Error searching commands:", error);
			setCommands([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Debounce the search
	useEffect(() => {
		const timer = setTimeout(() => {
			if (query) {
				searchCommands(query);
			} else {
				setCommands([]);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [query, searchCommands]);

	// Keyboard shortcut to open command palette
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const saveToRecentSearches = (searchQuery: string) => {
		const newRecentSearches = [
			searchQuery,
			...recentSearches.filter((s) => s !== searchQuery),
		].slice(0, 5);
		setRecentSearches(newRecentSearches);
		localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
	};

	const handleViewAllResults = () => {
		if (!query.trim()) return;
		saveToRecentSearches(query);
		const params = new URLSearchParams(searchParams);
		params.set("q", query);
		router.push(`/commands?${params.toString()}`);
		setOpen(false);
	};

	const handleSelectCommand = (command: Command) => {
		saveToRecentSearches(query);
		router.push(`/commands/${command.slug}`);
		setOpen(false);
	};

	const handleSelectRecent = (searchQuery: string) => {
		setQuery(searchQuery);
	};

	return (
		<>
			<Button
				variant="outline"
				className="relative w-full max-w-2xl justify-start text-sm text-muted-foreground"
				onClick={() => setOpen(true)}
			>
				<SearchIcon className="mr-2 h-4 w-4" />
				<span>Search commands...</span>
				<KbdGroup className="ml-auto">
					<Kbd>⌘</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</Button>

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				title="Search Commands"
				description="Search for keyboard commands to boost your productivity"
				shouldFilter={false}
			>
				<CommandInput
					placeholder="Type to search commands..."
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList>
					{loading ? (
						<div className="p-2 space-y-1">
							<div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
								Commands
							</div>
							{[1, 2, 3, 4, 5].map((id) => (
								<div key={`skeleton-${id}`} className="flex items-start gap-2 px-2 py-3">
									<Skeleton className="h-4 w-4 mt-0.5 shrink-0" />
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-4 w-[200px]" />
											<Skeleton className="h-5 w-20" />
										</div>
										<Skeleton className="h-3 w-full max-w-[300px]" />
									</div>
								</div>
							))}
						</div>
					) : (
						<>
							<CommandEmpty>
								{query ? (
									<div className="space-y-2">
										<p>No results found for "{query}"</p>
									</div>
								) : (
									<p>Start typing to search commands</p>
								)}
							</CommandEmpty>

							{recentSearches.length > 0 && !query && (
								<CommandGroup heading="Recent Searches">
									{recentSearches.map((search) => (
										<CommandItem
											key={search}
											value={search}
											onSelect={() => handleSelectRecent(search)}
										>
											<ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
											<span>{search}</span>
										</CommandItem>
									))}
								</CommandGroup>
							)}

							{commands.length > 0 && (
								<>
									<CommandGroup heading="Commands">
										{commands.map((command) => (
											<CommandItem
												key={command.id}
												value={command.title}
												onSelect={() => handleSelectCommand(command)}
												className="flex items-start gap-2 py-3"
											>
												<FileTextIcon className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
												<div className="flex-1 overflow-hidden">
													<div className="flex items-center gap-2">
														<span className="font-medium truncate">
															{command.title}
														</span>
														{command.category && (
															<Badge variant="secondary" className="text-xs">
																{command.category.name}
															</Badge>
														)}
													</div>
													{command.description && (
														<p className="text-xs text-muted-foreground line-clamp-1 mt-1">
															{command.description}
														</p>
													)}
												</div>
											</CommandItem>
										))}
									</CommandGroup>

									<CommandGroup>
										<CommandItem
											value={`view-all-${query}`}
											onSelect={handleViewAllResults}
											className="justify-center text-primary"
										>
											<SearchIcon className="mr-2 h-4 w-4" />
											<span>View all results for "{query}"</span>
											<KbdGroup className="ml-auto">
												<Kbd>↵</Kbd>
											</KbdGroup>
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</>
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
}

