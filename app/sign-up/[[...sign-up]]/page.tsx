import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your Cursor Commands Explorer account to bookmark commands and contribute to the community.',
  openGraph: {
    title: 'Sign Up - Cursor Commands Explorer',
    description:
      'Create your Cursor Commands Explorer account to bookmark commands and contribute to the community.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  )
}
