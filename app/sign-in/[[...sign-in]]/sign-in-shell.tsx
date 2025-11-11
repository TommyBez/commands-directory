'use client'

import { SignIn } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export function SignInShell() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 px-6 py-8 text-muted-foreground">
          Preparing sign-in...
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  )
}
