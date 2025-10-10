# Server Component Optimization Examples

Quick reference showing before/after code for each optimization opportunity.

---

## 1. Favorites Page - `/app/favorites/page.tsx`

### ❌ Before (Current - Lines 16-26)
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/bookmarks`,
  {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: 'no-store',
  },
)

const { data: bookmarks } = await response.json()
```

### ✅ After (Optimized)
```typescript
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { eq } from 'drizzle-orm'

// ... in component
const userBookmarks = await db.query.bookmarks.findMany({
  where: eq(bookmarks.userId, userId),
  with: {
    command: {
      with: {
        category: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    },
  },
  orderBy: (table, { desc }) => [desc(table.createdAt)],
})

// Use directly - no need to extract from response
// bookmarks becomes userBookmarks in the JSX
```

**Changes Needed:**
1. Remove `cookies()` import (line 2)
2. Add database imports
3. Replace fetch with direct query
4. Remove cookie handling
5. Update variable name from `bookmarks` to `userBookmarks` in JSX

---

## 2. Submissions Page - `/app/submissions/page.tsx`

### ❌ Before (Current - Lines 28-41)
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/user/commands`,
  {
    cache: 'no-store'
  },
)

if (!response.ok) {
  throw new Error('Failed to fetch user commands')
}

const { data: commands } = (await response.json()) as {
  data: CommandWithRelations[]
}
```

### ✅ After (Optimized)
```typescript
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { eq } from 'drizzle-orm'

// ... in component
const userCommands = await db.query.commands.findMany({
  where: eq(commands.submittedByUserId, userId),
  with: {
    category: true,
    tags: {
      with: {
        tag: true,
      },
    },
  },
  orderBy: (table, { desc }) => [desc(table.createdAt)],
})

// Update JSX to use userCommands instead of commands
```

**Changes Needed:**
1. Add database imports
2. Replace fetch with direct query
3. Remove error handling (Drizzle throws automatically)
4. Update variable from `commands` to `userCommands` in JSX

---

## 3. Admin Commands Page - `/app/admin/commands/page.tsx`

### ❌ Before (Current - Lines 39-61)
```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_URL

const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
  fetch(`${baseUrl}/api/admin/commands?status=pending`, {
    cache: 'no-store',
  }),
  fetch(`${baseUrl}/api/admin/commands?status=approved`, {
    cache: 'no-store',
  }),
  fetch(`${baseUrl}/api/admin/commands?status=rejected`, {
    cache: 'no-store',
  }),
])

const { data: pendingCommands } = (await pendingRes.json()) as {
  data: CommandWithRelations[]
}
const { data: approvedCommands } = (await approvedRes.json()) as {
  data: CommandWithRelations[]
}
const { data: rejectedCommands } = (await rejectedRes.json()) as {
  data: CommandWithRelations[]
}
```

### ✅ After (Optimized)
```typescript
// db already imported at line 7
import { commands } from '@/db/schema/commands'

// ... after admin check (line 36)

const [pendingCommands, approvedCommands, rejectedCommands] = await Promise.all([
  db.query.commands.findMany({
    where: eq(commands.status, 'pending'),
    with: {
      category: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  }),
  db.query.commands.findMany({
    where: eq(commands.status, 'approved'),
    with: {
      category: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  }),
  db.query.commands.findMany({
    where: eq(commands.status, 'rejected'),
    with: {
      category: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  }),
])
```

**Changes Needed:**
1. Add `commands` import from schema
2. Remove `baseUrl` variable
3. Replace 3 HTTP fetches with 3 direct queries
4. Remove all JSON parsing
5. Variable names stay the same (no JSX changes needed)

**Impact**: Eliminates 3 HTTP round-trips!

---

## 4. Command Detail Page - `/app/commands/[slug]/page.tsx`

### ❌ Before (Current - Lines 19-30)
```typescript
const { slug } = await params

const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/commands/${slug}`,
  { cache: 'no-store' },
)

if (!response.ok) {
  notFound()
}

const { data: command, related } = await response.json()
```

### ✅ After (Optimized)
```typescript
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { bookmarks } from '@/db/schema/bookmarks'
import { userProfiles } from '@/db/schema/user-profiles'
import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'

// ... in component
const { slug } = await params
const { userId } = await auth()

// Fetch main command
const command = await db.query.commands.findFirst({
  where: eq(commands.slug, slug),
  with: {
    category: true,
    tags: {
      with: {
        tag: true,
      },
    },
  },
})

if (!command) {
  notFound()
}

// Check visibility: approved OR (user is owner OR admin)
const isApproved = command.status === 'approved'

let canView = isApproved
if (!canView && userId) {
  const isOwner = command.submittedByUserId === userId
  if (isOwner) {
    canView = true
  } else {
    const profile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    })
    canView = profile?.role === 'admin'
  }
}

if (!canView) {
  notFound()
}

// Find related commands (same category, only approved)
const relatedCommands = command.categoryId
  ? await db.query.commands.findMany({
      where: and(
        eq(commands.categoryId, command.categoryId),
        eq(commands.status, 'approved'),
      ),
      limit: 5,
      with: {
        category: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    })
  : []

// Filter out the current command
const related = relatedCommands.filter((c) => c.id !== command.id)

// Get bookmarked command IDs if user is authenticated
let bookmarkedCommandIds: string[] = []
if (userId) {
  const userBookmarks = await db
    .select({ commandId: bookmarks.commandId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
  bookmarkedCommandIds = userBookmarks.map((b) => b.commandId)
}

// Add isBookmarked flag to command and related commands
const commandWithBookmark = {
  ...command,
  isBookmarked: bookmarkedCommandIds.includes(command.id),
}

const relatedWithBookmarks = related.map((cmd) => ({
  ...cmd,
  isBookmarked: bookmarkedCommandIds.includes(cmd.id),
}))

// Update JSX to use commandWithBookmark and relatedWithBookmarks
```

**Changes Needed:**
1. Add database imports
2. Add `auth()` call to get userId
3. Replace fetch with command query
4. Add visibility check logic
5. Add related commands query
6. Add bookmark status logic
7. Update JSX to use `commandWithBookmark` instead of `command`
8. Update JSX to use `relatedWithBookmarks` instead of `related`

**Complexity**: Medium (includes authorization and multiple queries)

---

## 5. Commands Listing Page - `/app/commands/page.tsx`

### ❌ Before (Current - Lines 23-45)
```typescript
const params = await searchParams
const queryString = new URLSearchParams(
  Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, string>,
  ),
).toString()

const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/commands?${queryString}`,
  { cache: 'no-store' },
)

const { data: commands, pagination } = (await response.json()) as {
  data: CommandWithRelations[]
  pagination: { total: number; page: number; totalPages: number }
}
```

### ✅ After (Optimized)
```typescript
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { categories } from '@/db/schema/categories'
import { commandTags, commandTagMap } from '@/db/schema/command-tags'
import { bookmarks } from '@/db/schema/bookmarks'
import { auth } from '@clerk/nextjs/server'
import { and, eq, ilike, inArray, or, sql, type SQL } from 'drizzle-orm'

// ... in component
const params = await searchParams
const { userId } = await auth()

// Parse query params
const q = params.q
const category = params.category
const tag = params.tag
const page = Number.parseInt(params.page || '1', 10)
const limit = 20
const offset = (page - 1) * limit

// Build where conditions
const conditions: SQL<unknown>[] = []
conditions.push(eq(commands.status, 'approved'))

// Text search
if (q) {
  const searchCondition = or(
    ilike(commands.title, `%${q}%`),
    ilike(commands.description, `%${q}%`),
    ilike(commands.content, `%${q}%`),
  )
  if (searchCondition) {
    conditions.push(searchCondition)
  }
}

// Category filter
if (category) {
  const cat = await db.query.categories.findFirst({
    where: eq(categories.slug, category),
  })
  if (cat) {
    conditions.push(eq(commands.categoryId, cat.id))
  }
}

// Tag filter
if (tag) {
  const tagRecord = await db.query.commandTags.findFirst({
    where: eq(commandTags.slug, tag),
  })
  if (tagRecord) {
    const commandIds = await db
      .select({ commandId: commandTagMap.commandId })
      .from(commandTagMap)
      .where(eq(commandTagMap.tagId, tagRecord.id))

    if (commandIds.length > 0) {
      conditions.push(
        inArray(
          commands.id,
          commandIds.map((c) => c.commandId),
        ),
      )
    }
  }
}

const whereClause = conditions.length > 0 ? and(...conditions) : undefined

// Execute queries
const [results, totalCount] = await Promise.all([
  db.query.commands.findMany({
    where: whereClause,
    limit,
    offset,
    with: {
      category: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  }),
  db
    .select({ count: sql<number>`count(*)` })
    .from(commands)
    .where(whereClause)
    .then((res) => Number(res[0]?.count || 0)),
])

// Get bookmarks
let bookmarkedCommandIds: string[] = []
if (userId) {
  const userBookmarks = await db
    .select({ commandId: bookmarks.commandId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
  bookmarkedCommandIds = userBookmarks.map((b) => b.commandId)
}

// Add isBookmarked flag
const commandsWithBookmarks = results.map((command) => ({
  ...command,
  isBookmarked: bookmarkedCommandIds.includes(command.id),
}))

// Build pagination
const pagination = {
  page,
  limit,
  total: totalCount,
  totalPages: Math.ceil(totalCount / limit),
}

// Use commandsWithBookmarks and pagination in JSX (same variable names)
```

**Changes Needed:**
1. Add all database imports
2. Add `auth()` call
3. Remove queryString building
4. Remove fetch call
5. Add query parameter parsing
6. Add where conditions building
7. Add database queries for commands and count
8. Add bookmark logic
9. Build pagination object
10. Variable names stay the same (no JSX changes)

**Complexity**: Medium-High (most complex due to filtering/pagination logic)

---

## Helper Functions to Extract (Optional)

For cleaner code, consider extracting reusable functions:

### `lib/db-queries/commands.ts`
```typescript
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { eq } from 'drizzle-orm'

export async function getBookmarkedCommandIds(
  userId: string | null,
): Promise<string[]> {
  if (!userId) {
    return []
  }

  const userBookmarks = await db
    .select({ commandId: bookmarks.commandId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))

  return userBookmarks.map((b) => b.commandId)
}

export function addBookmarkFlags<T extends { id: string }>(
  items: T[],
  bookmarkedIds: string[],
): (T & { isBookmarked: boolean })[] {
  return items.map((item) => ({
    ...item,
    isBookmarked: bookmarkedIds.includes(item.id),
  }))
}
```

This would simplify multiple pages by reusing common bookmark logic.

---

## Testing Checklist

After each optimization, verify:

- ✅ Page loads without errors
- ✅ Data displays correctly
- ✅ Filtering/search works (if applicable)
- ✅ Pagination works (if applicable)
- ✅ Authentication/authorization works
- ✅ Bookmark status displays correctly
- ✅ No console errors
- ✅ Performance improved (use browser DevTools)

---

## Performance Comparison

### Before (HTTP Fetch)
```
Server Component → 1-5ms → HTTP Request → 10-50ms network → API Route → 5-10ms → DB Query → 10-50ms → Response → 10-50ms network → Server Component
Total: ~50-200ms
```

### After (Direct Query)
```
Server Component → 1-5ms → DB Query → 10-50ms → Server Component
Total: ~15-60ms
```

**Expected improvement: 50-75% reduction in latency**
