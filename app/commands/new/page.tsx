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
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="font-bold text-3xl">Submit a Command</h1>
            <p className="mt-2 text-muted-foreground">
              Share a useful command with the community. Your submission will be
              reviewed by an administrator before being published.
            </p>
          </div>

          <SubmitCommandForm categories={categories} />
        </div>
      </main>
    </div>
  )
}
