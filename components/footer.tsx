import { SiGithub } from '@icons-pack/react-simple-icons'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="container mx-auto border-t px-4 py-6 text-center text-muted-foreground text-xs sm:py-8 sm:text-sm">
      <div className="flex flex-col items-center gap-2">
        <p>© 2025 Cursor Commands Explorer.</p>
        <Link
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          href="https://github.com/TommyBez/commands-directory"
          rel="noopener noreferrer"
          target="_blank"
        >
          <SiGithub className="h-4 w-4" />
          <span>View on GitHub</span>
        </Link>
      </div>
    </footer>
  )
}
