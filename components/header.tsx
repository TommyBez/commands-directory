import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { CommandIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          href="/"
        >
          <CommandIcon className="h-6 w-6" />
          <h1 className="font-bold text-xl">Cursor Commands Explorer</h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/commands">Browse</Link>
          </Button>
          <SignedIn>
            <Button asChild variant="ghost">
              <Link href="/favorites">Favorites</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-9 w-9',
                },
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
