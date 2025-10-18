'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function CommandsSearchInput() {
  const [query, setQuery] = useQueryState('q', {
    defaultValue: '',
    shallow: false,
  })
  const [isPending, startTransition] = useTransition()

  const handleClear = () => {
    startTransition(() => {
      setQuery(null)
    })
  }

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
    <div className="relative w-full max-w-2xl">
      <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
      <Input
        className="pr-9 pl-9"
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search commands by title, description, or content..."
        type="search"
        value={query}
      />
      {query && (
        <Button
          className="-translate-y-1/2 absolute top-1/2 right-1 h-7 w-7"
          disabled={isPending}
          onClick={handleClear}
          size="icon"
          type="button"
          variant="ghost"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
