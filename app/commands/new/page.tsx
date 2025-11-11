import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { unstable_noStore } from 'next/cache'
import { SubmitCommandForm } from '@/components/submit-command-form'
import { db } from '@/db'
import { getOptionalClerkId } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Submit a Command',
  description:
    'Share a useful Cursor command with the community. Your submission will be reviewed before being published.',
  openGraph: {
    title: 'Submit a Command - Cursor Commands Explorer',
    description:
      'Share a useful Cursor command with the community. Your submission will be reviewed before being published.',
  },
}

export default async function NewCommandPage() {
  unstable_noStore()
  const clerkId = await getOptionalClerkId()

  if (!clerkId) {
    redirect('/sign-in')
  }

  const categories = await db.query.categories.findMany({
    orderBy: (table, { asc }) => [asc(table.name)],
  })

  return (
    <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl">Submit a Command</h1>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            Share a useful command with the community. Your submission will be
            reviewed by an administrator before being published.
          </p>
        </div>
        <SubmitCommandForm categories={categories} />
      </div>
    </main>
  )
}
