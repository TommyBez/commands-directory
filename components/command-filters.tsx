'use client'

import { XIcon } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { parseAsString } from 'nuqs/server'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CommandFilters() {
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useQueryStates(
    {
      category: parseAsString.withDefault(''),
      tag: parseAsString.withDefault(''),
      page: parseAsString,
    },
    {
      shallow: false,
    },
  )

  const handleFilterChange = (key: 'category' | 'tag', value: string) => {
    startTransition(() => {
      setFilters({
        [key]: value && value !== 'all' ? value : null,
        page: null, // Reset to first page
      })
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      setFilters({
        category: null,
        tag: null,
        page: null,
      })
    })
  }

  const hasFilters = filters.category || filters.tag

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">Category</span>
        <Select
          disabled={isPending}
          onValueChange={(value) => handleFilterChange('category', value)}
          value={filters.category || 'all'}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="development-workflow">
              Development Workflow
            </SelectItem>
            <SelectItem value="code-quality">Code Quality</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="project-setup">Project Setup</SelectItem>
            <SelectItem value="team-collaboration">
              Team Collaboration
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">Tag</span>
        <Select
          disabled={isPending}
          onValueChange={(value) => handleFilterChange('tag', value)}
          value={filters.tag || 'all'}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="git">Git</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="setup">Setup</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          className="w-full sm:w-auto"
          disabled={isPending}
          onClick={clearFilters}
          size="sm"
          variant="outline"
        >
          <XIcon className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
