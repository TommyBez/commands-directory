'use client'

import { useQueryState } from 'nuqs'
import { useTransition } from 'react'
import { Input } from '@/components/ui/input'

export function CommandsSearchInput() {
  const [query, setQuery] = useQueryState('q', {
    defaultValue: '',
    shallow: false,
  })
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    startTransition(() => {
      if (value) {
        setQuery(value)
      } else {
        setQuery(null)
      }
    })
  }

  return (
    <div className="w-full max-w-2xl">
      <Input
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search commands by title, description, or content..."
        type="search"
        value={query}
      />
    </div>
  )
}
