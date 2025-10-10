import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SubmitCommandForm } from '@/components/submit-command-form'
import { db } from '@/db'

export default async function NewCommandPage() {
  const { userId } = await auth()

  if (!userId) {
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
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Share a useful command with the community. Your submission will be
              reviewed by an administrator before being published.
            </p>
          </div>

          <SubmitCommandForm categories={categories} />
        </div>
    </main>
  )
}
