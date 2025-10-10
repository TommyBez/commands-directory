'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { CommandIcon, MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

type HeaderProps = {
  isAdmin?: boolean
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          href="/"
        >
          <CommandIcon className="h-6 w-6" />
          <h1 className="font-bold text-lg sm:text-xl">
            <span className="hidden sm:inline">Cursor Commands Explorer</span>
            <span className="sm:hidden">Commands</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/commands">Browse</Link>
          </Button>
          <SignedIn>
            <Button asChild variant="ghost">
              <Link href="/favorites">Favorites</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/commands/new">Submit</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/submissions">My Submissions</Link>
            </Button>
          </SignedIn>
          {isAdmin && (
            <Button asChild variant="ghost">
              <Link href="/admin/commands">Admin</Link>
            </Button>
          )}
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

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
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
          <Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                {mobileMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                <Button
                  asChild
                  className="justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                  variant="ghost"
                >
                  <Link href="/commands">Browse Commands</Link>
                </Button>
                <SignedIn>
                  <Button
                    asChild
                    className="justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                    variant="ghost"
                  >
                    <Link href="/favorites">Favorites</Link>
                  </Button>
                  <Button
                    asChild
                    className="justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                    variant="ghost"
                  >
                    <Link href="/commands/new">Submit Command</Link>
                  </Button>
                  <Button
                    asChild
                    className="justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                    variant="ghost"
                  >
                    <Link href="/submissions">My Submissions</Link>
                  </Button>
                </SignedIn>
                {isAdmin && (
                  <Button
                    asChild
                    className="justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                    variant="ghost"
                  >
                    <Link href="/admin/commands">Admin Panel</Link>
                  </Button>
                )}
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="justify-start" variant="outline">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
