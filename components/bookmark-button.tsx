'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

const BOOKMARK_ALREADY_EXISTS_STATUS = 409

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
  const { getToken } = useAuth()
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

  const handleBookmarkResponse = async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      if (response.status === BOOKMARK_ALREADY_EXISTS_STATUS && !isBookmarked) {
        setIsBookmarked(true)
        toast.info('Command is already in your favorites')
        return { success: true }
      }
      throw new Error(data.error || 'Failed to update bookmark')
    }
    return { success: false }
  }

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!handleAuthCheck()) {
      return
    }

    setIsLoading(true)

    try {
      const token = await getToken()
      const method = isBookmarked ? 'DELETE' : 'POST'

      const response = await fetch('/api/bookmarks', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commandId }),
      })

      const result = await handleBookmarkResponse(response)
      if (result.success) {
        return
      }

      setIsBookmarked(!isBookmarked)
      toast.success(
        isBookmarked ? 'Removed from favorites' : 'Added to favorites',
      )
      router.refresh()
    } catch (error) {
      logger.error('Error toggling bookmark:', error)
      toast.error('Failed to update bookmark')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
}
