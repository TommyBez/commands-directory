import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CommandDetailLoading() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Breadcrumb */}
					<div className="flex gap-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-5 w-32" />
					</div>

					{/* Main Content */}
					<div className="space-y-6">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1 space-y-4">
								<Skeleton className="h-10 w-3/4" />
								<Skeleton className="h-6 w-full" />
								<Skeleton className="h-6 w-2/3" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-10 w-28" />
								<Skeleton className="h-10 w-24" />
							</div>
						</div>

						{/* Command Content */}
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-40" />
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
								</div>
							</CardContent>
						</Card>

						{/* Metadata */}
						<div className="flex flex-wrap gap-4 items-center">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-5 w-24" />
							</div>
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-12" />
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-5 w-20" />
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							<Skeleton className="h-10 flex-1" />
						</div>

						{/* Related Commands */}
						<Separator />
						<div className="space-y-4">
							<Skeleton className="h-8 w-56" />
							<div className="grid gap-4 md:grid-cols-2">
								{Array.from({ length: 4 }, (_, i) => `related-${i}`).map((key) => (
									<Card key={key}>
										<CardHeader>
											<div className="flex items-start justify-between gap-2">
												<Skeleton className="h-6 w-3/4" />
												<Skeleton className="h-8 w-8 rounded-full" />
											</div>
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-2/3" />
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												<Skeleton className="h-20 w-full" />
												<div className="flex items-center justify-between">
													<div className="flex gap-2">
														<Skeleton className="h-5 w-16" />
														<Skeleton className="h-5 w-16" />
													</div>
													<Skeleton className="h-9 w-20" />
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

