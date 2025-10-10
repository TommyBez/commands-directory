'use client'

import { ClockIcon, FileTextIcon, SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/logger'

const MAX_RECENT_SEARCHES = 5
const SEARCH_COMMANDS_DELAY = 300

type Command = {
  id: string
  slug: string
  title: string
  description: string | null
  category: {
    name: string
    slug: string
  } | null
}

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [commands, setCommands] = useState<Command[]>([])
  const [loading, setLoading] = useState(false)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Debounced search function
  const searchCommands = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setCommands([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `/api/commands?q=${encodeURIComponent(searchQuery)}&limit=8`,
      )
      const data = await response.json()
      setCommands(data.data || [])
    } catch (error) {
      logger.error('Error searching commands:', error)
      setCommands([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchCommands(query)
      } else {
        setCommands([])
      }
    }, SEARCH_COMMANDS_DELAY)

    return () => clearTimeout(timer)
  }, [query, searchCommands])

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prevOpen) => !prevOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const saveToRecentSearches = (searchQuery: string) => {
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, MAX_RECENT_SEARCHES)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
  }

  const handleViewAllResults = () => {
    if (!query.trim()) {
      return
    }
    saveToRecentSearches(query)
    const params = new URLSearchParams(searchParams)
    params.set('q', query)
    router.push(`/commands?${params.toString()}`)
    setOpen(false)
  }

  const handleSelectCommand = (command: Command) => {
    saveToRecentSearches(query)
    router.push(`/commands/${command.slug}`)
    setOpen(false)
  }

  const handleSelectRecent = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  return (
    <>
      <Button
        className="relative w-full max-w-2xl justify-start text-muted-foreground text-sm"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span>Search commands...</span>
        <KbdGroup className="ml-auto">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog
        description="Search for keyboard commands to boost your productivity"
        onOpenChange={setOpen}
        open={open}
        shouldFilter={false}
        title="Search Commands"
      >
        <CommandInput
          onValueChange={setQuery}
          placeholder="Type to search commands..."
          value={query}
        />
        <CommandList>
          {loading ? (
            <div className="space-y-1 p-2">
              <div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
                Commands
              </div>
              {[
                'skeleton-1',
                'skeleton-2',
                'skeleton-3',
                'skeleton-4',
                'skeleton-5',
              ].map((key) => (
                <div className="flex items-start gap-2 px-2 py-3" key={key}>
                  <Skeleton className="mt-0.5 h-4 w-4 shrink-0" />
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
                      onSelect={() => handleSelectRecent(search)}
                      value={search}
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
                        className="flex items-start gap-2 py-3"
                        key={command.id}
                        onSelect={() => handleSelectCommand(command)}
                        value={command.title}
                      >
                        <FileTextIcon className="mt-0.5 mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium">
                              {command.title}
                            </span>
                            {command.category && (
                              <Badge className="text-xs" variant="secondary">
                                {command.category.name}
                              </Badge>
                            )}
                          </div>
                          {command.description && (
                            <p className="mt-1 line-clamp-1 text-muted-foreground text-xs">
                              {command.description}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <CommandGroup>
                    <CommandItem
                      className="justify-center text-primary"
                      onSelect={handleViewAllResults}
                      value={`view-all-${query}`}
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
  )
}
