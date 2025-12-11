'use client'

import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { submitCommand } from '@/app/actions/commands'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
}

type SubmitCommandFormProps = {
  categories: Category[]
}

type SubmitCommandInput = {
  title: string
  description: string
  content: string
  categoryId: string
}

type SubmitResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string; status?: number }

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 500
const MAX_CONTENT_LENGTH = 10_000

async function submitCommandAction(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  const result = await submitCommand({
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    content: formData.get('content') as string,
    categoryId: (formData.get('categoryId') as string) || null,
  })

  return result
}

export function SubmitCommandForm({ categories }: SubmitCommandFormProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(submitCommandAction, null)

  const form = useForm<SubmitCommandInput>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      categoryId: '',
    },
  })

  const titleLength = form.watch('title').length
  const descriptionLength = form.watch('description').length
  const contentLength = form.watch('content').length

  useEffect(() => {
    if (state?.ok) {
      router.push('/submissions')
    }
  }, [state, router])

  return (
    <div className="relative w-full max-w-3xl bg-background p-4">
      <div className="-left-px -inset-y-6 absolute w-px bg-border" />
      <div className="-right-px -inset-y-6 absolute w-px bg-border" />
      <div className="-top-px -inset-x-6 absolute h-px bg-border" />
      <div className="-bottom-px -inset-x-6 absolute h-px bg-border" />
      <PlusIcon
        className="-left-[12.5px] -top-[12.5px] absolute size-6"
        strokeWidth={0.5}
      />
      <PlusIcon
        className="-right-[12.5px] -bottom-[12.5px] absolute size-6"
        strokeWidth={0.5}
      />
      <PlusIcon
        className="-right-[12.5px] -top-[12.5px] absolute size-6"
        strokeWidth={0.5}
      />
      <PlusIcon
        className="-left-[12.5px] -bottom-[12.5px] absolute size-6"
        strokeWidth={0.5}
      />

      <div className="rounded-md border border-border/60 p-[2px]">
        <div className="items-left flex flex-col justify-center gap-1 rounded-md border bg-card p-4 shadow-xs">
          <h2 className="font-medium text-xl">Command Details</h2>
          <p className="text-muted-foreground text-sm">
            Submit your command for review.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form action={formAction}>
          <FieldGroup className="p-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="title"
                        maxLength={MAX_TITLE_LENGTH}
                        placeholder="e.g., List all files with details"
                        required
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="text-muted-foreground text-xs">
                        {titleLength}/{MAX_TITLE_LENGTH} characters
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="description"
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        placeholder="Brief description of what this command does"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="text-muted-foreground text-xs">
                        {descriptionLength}/{MAX_DESCRIPTION_LENGTH} characters
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel htmlFor="content">
                      Command <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="font-mono text-sm"
                        id="content"
                        maxLength={MAX_CONTENT_LENGTH}
                        placeholder="Insert your command here"
                        required
                        rows={6}
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="text-muted-foreground text-xs">
                        {contentLength}/{MAX_CONTENT_LENGTH} characters
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel htmlFor="category">Category</FieldLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
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
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </FieldGroup>

          {state && !state.ok && (
            <div className="px-4 pb-2">
              <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
                {state.error || 'Failed to submit command'}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 p-4 pt-2 sm:flex-row sm:gap-4">
            <Button className="flex-1" disabled={pending} type="submit">
              {pending ? 'Submitting...' : 'Submit Command'}
            </Button>
            <Button
              className="flex-1 sm:flex-initial"
              disabled={pending}
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
