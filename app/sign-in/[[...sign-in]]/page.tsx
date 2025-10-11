import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your Cursor Commands Explorer account to access your favorites and submissions.',
  openGraph: {
    title: 'Sign In - Cursor Commands Explorer',
    description:
      'Sign in to your Cursor Commands Explorer account to access your favorites and submissions.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  )
}
