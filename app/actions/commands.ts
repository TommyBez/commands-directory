'use server'

import { randomUUID } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema/categories'
import { commands } from '@/db/schema/commands'
import { checkAdminAccess, getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 500
const MAX_CONTENT_LENGTH = 10_000
const SLUG_RANDOM_SUFFIX_LENGTH = 4
const MAX_INSERT_RETRIES = 3

type SubmitCommandInput = {
  title: string
  description: string | null
  content: string
  categoryId: string | null
}

type CommandRecord = typeof commands.$inferSelect

type SubmitResult =
  | { ok: true; data: CommandRecord }
  | { ok: false; error: string; status?: number }

type TrimmedInput = {
  title: string
  description: string | null
  content: string
}

function validateInput(input: TrimmedInput): SubmitResult | null {
  if (!input.title) {
    return { ok: false, error: 'Title is required', status: 400 }
  }

  if (!input.content) {
    return { ok: false, error: 'Content is required', status: 400 }
  }

  if (input.title.length > MAX_TITLE_LENGTH) {
    return {
      ok: false,
      error: `Title must be ${MAX_TITLE_LENGTH} characters or less`,
      status: 400,
    }
  }

  if (input.description && input.description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`,
      status: 400,
    }
  }

  if (input.content.length > MAX_CONTENT_LENGTH) {
    return {
      ok: false,
      error: `Content must be ${MAX_CONTENT_LENGTH} characters or less`,
      status: 400,
    }
  }

  return null
}

function revalidateCommandCaches(command: CommandRecord) {
  revalidateTag('commands')
  revalidateTag('registry')

  if (command.slug) {
    revalidateTag(`command:${command.slug}`)
    revalidateTag(`registry:item:${command.slug}`)
  }

  if (command.categoryId) {
    revalidateTag(`commands:category:${command.categoryId}`)
  }
}

async function validateCategory(categoryId: string): Promise<boolean> {
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  })
  return Boolean(category)
}

function generateBaseSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = base
  let counter = 2
  while (true) {
    const existing = await db.query.commands.findFirst({
      where: eq(commands.slug, slug),
    })
    if (!existing) {
      return slug
    }
    slug = `${base}-${counter}-${randomUUID().slice(0, SLUG_RANDOM_SUFFIX_LENGTH)}`
    counter++
  }
}

async function insertCommandWithRetry(params: {
  profileId: string
  title: string
  description: string | null
  content: string
  categoryId: string | null
  baseSlug: string
}): Promise<CommandRecord> {
  for (let attempt = 1; attempt <= MAX_INSERT_RETRIES; attempt++) {
    try {
      const slug = await generateUniqueSlug(params.baseSlug)

      const [insertedCommand] = await db
        .insert(commands)
        .values({
          title: params.title,
          description: params.description,
          content: params.content,
          categoryId: params.categoryId ?? null,
          slug,
          status: 'pending',
          submittedByUserId: params.profileId,
        })
        .returning()

      return insertedCommand
    } catch (e: unknown) {
      const error = e as { code?: string; originalError?: { code?: string } }
      const code = error?.code ?? error?.originalError?.code

      // Error code 23505 is PostgreSQL unique constraint violation
      if (code === '23505' && attempt < MAX_INSERT_RETRIES) {
        continue
      }

      throw e
    }
  }

  throw new Error('Slug conflict after retries')
}

export async function submitCommand(
  input: SubmitCommandInput,
): Promise<SubmitResult> {
  const { userId } = await auth()
  if (!userId) {
    return { ok: false, error: 'Unauthorized', status: 401 }
  }

  const profile = await getUserProfile(userId)
  if (!profile) {
    return { ok: false, error: 'Profile not found', status: 404 }
  }

  const trimmedInput: TrimmedInput = {
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    content: input.content.trim(),
  }

  const validationError = validateInput(trimmedInput)
  if (validationError) {
    return validationError
  }

  if (input.categoryId) {
    const isValidCategory = await validateCategory(input.categoryId)
    if (!isValidCategory) {
      return { ok: false, error: 'Invalid category', status: 400 }
    }
  }

  const baseSlug = generateBaseSlug(trimmedInput.title)

  try {
    const insertedCommand = await insertCommandWithRetry({
      profileId: profile.id,
      title: trimmedInput.title,
      description: trimmedInput.description,
      content: trimmedInput.content,
      categoryId: input.categoryId,
      baseSlug,
    })

    return { ok: true, data: insertedCommand }
  } catch {
    return { ok: false, error: 'Slug conflict. Please retry.', status: 409 }
  }
}

export async function approveCommand(commandId: string): Promise<SubmitResult> {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return { ok: false, error: 'Unauthorized', status: 401 }
    }

    const isAdmin = await checkAdminAccess(clerkId)
    if (!isAdmin) {
      return { ok: false, error: 'Forbidden', status: 403 }
    }

    const profile = await getUserProfile(clerkId)
    if (!profile) {
      return { ok: false, error: 'Profile not found', status: 404 }
    }

    // Check if command exists
    const command = await db.query.commands.findFirst({
      where: eq(commands.id, commandId),
    })

    if (!command) {
      return { ok: false, error: 'Command not found', status: 404 }
    }

    // Update command status
    const [updatedCommand] = await db
      .update(commands)
      .set({
        status: 'approved',
        reviewedAt: new Date(),
        reviewedByUserId: profile.id,
        rejectionReason: null,
      })
      .where(eq(commands.id, commandId))
      .returning()

    revalidateCommandCaches(updatedCommand)

    return { ok: true, data: updatedCommand }
  } catch (error) {
    logger.error('Error approving command:', error)
    return { ok: false, error: 'Failed to approve command', status: 500 }
  }
}

export async function rejectCommand(
  commandId: string,
  reason: string | null,
): Promise<SubmitResult> {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return { ok: false, error: 'Unauthorized', status: 401 }
    }

    const isAdmin = await checkAdminAccess(clerkId)
    if (!isAdmin) {
      return { ok: false, error: 'Forbidden', status: 403 }
    }

    const profile = await getUserProfile(clerkId)
    if (!profile) {
      return { ok: false, error: 'Profile not found', status: 404 }
    }

    // Check if command exists
    const command = await db.query.commands.findFirst({
      where: eq(commands.id, commandId),
    })

    if (!command) {
      return { ok: false, error: 'Command not found', status: 404 }
    }

    // Update command status
    const [updatedCommand] = await db
      .update(commands)
      .set({
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedByUserId: profile.id,
        rejectionReason: reason || null,
      })
      .where(eq(commands.id, commandId))
      .returning()

    revalidateCommandCaches(updatedCommand)

    return { ok: true, data: updatedCommand }
  } catch (error) {
    logger.error('Error rejecting command:', error)
    return { ok: false, error: 'Failed to reject command', status: 500 }
  }
}

type DeleteResult = { ok: true } | { ok: false; error: string; status?: number }

export async function deleteCommand(commandId: string): Promise<DeleteResult> {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return { ok: false, error: 'Unauthorized', status: 401 }
    }

    const isAdmin = await checkAdminAccess(clerkId)
    if (!isAdmin) {
      return { ok: false, error: 'Forbidden', status: 403 }
    }

    // Check if command exists
    const command = await db.query.commands.findFirst({
      where: eq(commands.id, commandId),
    })

    if (!command) {
      return { ok: false, error: 'Command not found', status: 404 }
    }

    // Delete the command
    await db.delete(commands).where(eq(commands.id, commandId))

    revalidateCommandCaches(command)

    return { ok: true }
  } catch (error) {
    logger.error('Error deleting command:', error)
    return { ok: false, error: 'Failed to delete command', status: 500 }
  }
}
