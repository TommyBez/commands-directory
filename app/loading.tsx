import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

export default function HomeLoading() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="bg-gradient-to-b from-background to-muted/50 py-20">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto text-center space-y-8">
							<div className="space-y-4">
								<Skeleton className="h-16 w-3/4 mx-auto" />
								<Skeleton className="h-16 w-2/3 mx-auto" />
							</div>
							<Skeleton className="h-6 w-2/3 mx-auto" />
							<div className="flex flex-col items-center gap-4">
								<Skeleton className="h-12 w-full max-w-2xl" />
								<Skeleton className="h-4 w-80" />
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-16 container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
						{Array.from({ length: 3 }, (_, i) => `feature-${i}`).map((key) => (
							<Card key={key}>
								<CardHeader>
									<Skeleton className="h-8 w-8 mb-2" />
									<Skeleton className="h-6 w-32 mb-2" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</CardHeader>
							</Card>
						))}
					</div>
				</section>

				{/* Categories Section */}
				<section className="py-16 bg-muted/50">
					<div className="container mx-auto px-4">
						<div className="max-w-5xl mx-auto">
							<Skeleton className="h-9 w-64 mx-auto mb-8" />
							<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
								{Array.from({ length: 4 }, (_, i) => `category-${i}`).map((key) => (
									<Card key={key}>
										<CardHeader>
											<Skeleton className="h-6 w-32 mb-2" />
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-3/4" />
										</CardHeader>
									</Card>
								))}
							</div>
							<div className="text-center mt-8">
								<Skeleton className="h-11 w-48 mx-auto" />
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t py-8">
				<div className="container mx-auto px-4 text-center">
					<Skeleton className="h-4 w-96 mx-auto" />
				</div>
			</footer>
		</div>
	);
}

