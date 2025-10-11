import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AppSidebarWrapper } from '@/components/app-sidebar-wrapper'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Cursor Commands Explorer',
    template: '%s | Cursor Commands Explorer',
  },
  description:
    'Discover, search, and master keyboard-driven commands for Cursor. Copy-ready command snippets shared by the community.',
  keywords: [
    'cursor',
    'commands',
    'keyboard shortcuts',
    'productivity',
    'developer tools',
    'code editor',
  ],
  authors: [{ name: 'Cursor Commands Explorer' }],
  creator: 'Cursor Commands Explorer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cursor-commands.com',
    siteName: 'Cursor Commands Explorer',
    title: 'Cursor Commands Explorer',
    description:
      'Discover, search, and master keyboard-driven commands for Cursor. Copy-ready command snippets shared by the community.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursor Commands Explorer',
    description:
      'Discover, search, and master keyboard-driven commands for Cursor. Copy-ready command snippets shared by the community.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <SidebarProvider>
              <AppSidebarWrapper />
              <SidebarInset>
                <Header />
                <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
                  {children}
                  <Footer />
                </div>
                <Toaster />
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
