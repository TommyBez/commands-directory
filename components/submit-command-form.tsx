'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { logger } from '@/lib/logger'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
}

type SubmitCommandFormProps = {
  categories: Category[]
}

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 500
const MAX_CONTENT_LENGTH = 10_000

export function SubmitCommandForm({ categories }: SubmitCommandFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    categoryId: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          content: formData.content,
          categoryId: formData.categoryId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit command')
      }

      // Redirect to submissions page
      router.push('/submissions')
    } catch (err) {
      logger.error('Error submitting command:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit command')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Command Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-sm" htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., List all files with details"
              required
              type="text"
              value={formData.title}
            />
            <p className="text-muted-foreground text-xs">
              {formData.title.length}/{MAX_TITLE_LENGTH} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm" htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of what this command does"
              rows={3}
              value={formData.description}
            />
            <p className="text-muted-foreground text-xs">
              {formData.description.length}/{MAX_DESCRIPTION_LENGTH} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm" htmlFor="content">
              Command <span className="text-destructive">*</span>
            </Label>
            <Textarea
              className="font-mono text-sm"
              id="content"
              maxLength={MAX_CONTENT_LENGTH}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="ls -la"
              required
              rows={6}
              value={formData.content}
            />
            <p className="text-muted-foreground text-xs">
              {formData.content.length}/{MAX_CONTENT_LENGTH} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm" htmlFor="category">
              Category
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
              value={formData.categoryId}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category (optional)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button className="flex-1" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Submitting...' : 'Submit Command'}
            </Button>
            <Button
              className="flex-1 sm:flex-initial"
              disabled={isSubmitting}
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
