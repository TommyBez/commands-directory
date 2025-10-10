"use client";

import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CopyCommandButtonProps {
	content: string;
}

export function CopyCommandButton({ content }: CopyCommandButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button onClick={handleCopy} size="lg">
			{copied ? (
				<>
					<CheckIcon className="h-4 w-4 mr-2" />
					Copied!
				</>
			) : (
				<>
					<CopyIcon className="h-4 w-4 mr-2" />
					Copy Command
				</>
			)}
		</Button>
	);
}

