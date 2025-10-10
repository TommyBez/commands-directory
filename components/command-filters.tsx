'use client'

import { XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CommandFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to first page
    router.push(`/commands?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) params.set('q', q)
    router.push(`/commands?${params.toString()}`)
  }

  const hasFilters = searchParams.has('category') || searchParams.has('tag')

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">Category</span>
        <Select
          onValueChange={(value) => handleFilterChange('category', value)}
          value={searchParams.get('category') || 'all'}
        >
          <SelectTrigger className="w-[200px]">
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
          onValueChange={(value) => handleFilterChange('tag', value)}
          value={searchParams.get('tag') || 'all'}
        >
          <SelectTrigger className="w-[200px]">
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
        <Button onClick={clearFilters} size="sm" variant="outline">
          <XIcon className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
