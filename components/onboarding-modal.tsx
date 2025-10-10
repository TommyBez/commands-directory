"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchIcon, BookmarkIcon, FilterIcon } from "lucide-react";

export function OnboardingModal() {
	const { userId } = useAuth();
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (userId) {
			// Check if user has dismissed onboarding
			const dismissed = localStorage.getItem("onboarding_dismissed");
			if (!dismissed) {
				setOpen(true);
			}
		}
	}, [userId]);

	const handleDismiss = async () => {
		localStorage.setItem("onboarding_dismissed", "true");
		setOpen(false);

		// Optionally save to database
		if (userId) {
			try {
				await fetch("/api/user/profile", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ onboardingDismissed: true }),
				});
			} catch (error) {
				console.error("Failed to save onboarding state:", error);
			}
		}
	};

	const steps = [
		{
			title: "Welcome to Cursor Commands Explorer!",
			description:
				"Discover and master keyboard shortcuts to boost your productivity. Let's take a quick tour.",
			icon: SearchIcon,
		},
		{
			title: "Search & Filter",
			description:
				"Use our powerful search to find commands by name or description. Filter by category and tags to find the perfect command for your workflow.",
			icon: FilterIcon,
		},
		{
			title: "Save Your Favorites",
			description:
				"Bookmark commands you use frequently and add personal notes to remember context.",
			icon: BookmarkIcon,
		},
	];

	const currentStep = steps[step];
	const Icon = currentStep.icon;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<div className="flex justify-center mb-4">
						<div className="p-3 bg-primary/10 rounded-full">
							<Icon className="h-8 w-8 text-primary" />
						</div>
					</div>
					<DialogTitle className="text-center">{currentStep.title}</DialogTitle>
					<DialogDescription className="text-center">
						{currentStep.description}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex-col sm:flex-row gap-2">
					<Button variant="outline" onClick={handleDismiss}>
						Skip
					</Button>
					{step < steps.length - 1 ? (
						<Button onClick={() => setStep(step + 1)}>Next</Button>
					) : (
						<Button onClick={handleDismiss}>Get Started</Button>
					)}
				</DialogFooter>
				<div className="flex justify-center gap-2 mt-4">
					{steps.map((stepData, i) => (
						<div
							key={stepData.title}
							className={`h-1.5 w-8 rounded-full transition-colors ${
								i === step ? "bg-primary" : "bg-muted"
							}`}
						/>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

