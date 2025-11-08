'use client'

import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { addBookmark, deleteBookmark } from '@/app/actions/bookmarks'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { logger } from '@/lib/logger'

const HTTP_STATUS_CONFLICT = 409

type BookmarkButtonProps = {
  commandId: string
  initialBookmarked?: boolean
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showText?: boolean
}

export function BookmarkButton({
  commandId,
  initialBookmarked = false,
  variant = 'ghost',
  size = 'icon',
  showText = false,
}: BookmarkButtonProps) {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsBookmarked(initialBookmarked)
  }, [initialBookmarked])

  const handleAuthCheck = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to bookmark commands')
      router.push('/sign-in')
      return false
    }
    return true
  }

  const handleBookmarkSuccess = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(
      isBookmarked ? 'Removed from favorites' : 'Added to favorites',
    )
    router.refresh()
  }

  const handleBookmarkError = (result: {
    ok: boolean
    status?: number
    error?: string
  }) => {
    if (result.status === HTTP_STATUS_CONFLICT && !isBookmarked) {
      setIsBookmarked(true)
      toast.info('Command is already in your favorites')
      return true
    }
    toast.error(result.error || 'Failed to update bookmark')
    return false
  }

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!handleAuthCheck()) {
      return
    }

    setIsLoading(true)

    try {
      const result = isBookmarked
        ? await deleteBookmark(commandId)
        : await addBookmark(commandId)

      if (!result.ok) {
        handleBookmarkError(result)
        return
      }

      handleBookmarkSuccess()
    } catch (error) {
      logger.error('Error toggling bookmark:', error)
      toast.error('Failed to update bookmark')
    } finally {
      setIsLoading(false)
    }
  }

  const isIconOnly = !showText || size === 'icon'
  const button = (
    <Button
      aria-label={isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
      className={isBookmarked ? 'text-red-500 hover:text-red-600' : ''}
      disabled={isLoading}
      onClick={handleToggleBookmark}
      size={size}
      variant={variant}
    >
      <Heart
        className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''} ${showText ? 'mr-2' : ''}`}
      />
      {showText && (
        <span>
          {isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
        </span>
      )}
    </Button>
  )

  if (isIconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          {isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}
