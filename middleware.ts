import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/commands(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and OG/Twitter images
    '/((?!_next|opengraph-image|twitter-image|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Run for protected API routes only
    '/api/admin(.*)',
    '/api/bookmarks(.*)',
    '/api/notes(.*)',
    '/api/reports(.*)',
    '/api/user(.*)',
    '/(trpc)(.*)',
  ],
}
