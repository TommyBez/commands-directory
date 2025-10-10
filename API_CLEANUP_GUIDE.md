# API Routes Cleanup Guide

After optimizing server components to use direct database queries, several API route GET handlers are no longer needed.

---

## ✅ Client Components Using API Routes (Keep These)

These are actively used by client components and must be kept:

### Mutation Endpoints (All Safe)
1. **`POST /api/commands`** 
   - Used by: `components/submit-command-form.tsx`
   - Purpose: Submit new command
   - **Keep entire file**

2. **`POST /api/bookmarks`**
   - Used by: `components/bookmark-button.tsx`
   - Purpose: Create bookmark
   - **Keep POST handler**

3. **`DELETE /api/bookmarks`**
   - Used by: `components/bookmark-button.tsx`
   - Purpose: Remove bookmark
   - **Keep DELETE handler**

4. **`PATCH /api/admin/commands/[id]/approve`**
   - Used by: `components/moderation-actions.tsx`
   - Purpose: Approve command
   - **Keep entire file**

5. **`PATCH /api/admin/commands/[id]/reject`**
   - Used by: `components/moderation-actions.tsx`
   - Purpose: Reject command
   - **Keep entire file**

6. **`POST /api/user/profile`**
   - Used by: `components/onboarding-modal.tsx`
   - Purpose: Create user profile
   - **Keep entire file**

---

## 🗑️ Unused API Routes (Can Be Removed)

These GET endpoints are no longer called by any server or client components:

### 1. `app/api/bookmarks/route.ts` - GET Handler

**Status:** ❌ No longer used  
**Previously used by:** `app/favorites/page.tsx` (now uses direct query)

**Action:** Remove GET handler, keep POST and DELETE

```typescript
// BEFORE: Has GET, POST, DELETE
export async function GET() { ... }
export async function POST() { ... }
export async function DELETE() { ... }

// AFTER: Keep only POST and DELETE
export async function POST() { ... }
export async function DELETE() { ... }
```

**Lines to delete:** Lines 8-40 (GET handler)

---

### 2. `app/api/commands/[slug]/route.ts` - GET Handler

**Status:** ❌ No longer used  
**Previously used by:** `app/commands/[slug]/page.tsx` (now uses direct query)

**Action:** Can remove entire file (only has GET handler)

**File to delete:** `app/api/commands/[slug]/route.ts` (entire file)

---

### 3. `app/api/commands/route.ts` - GET Handler

**Status:** ❌ No longer used  
**Previously used by:** `app/commands/page.tsx` (now uses direct query)

**Action:** Remove GET handler, keep POST

```typescript
// BEFORE: Has GET and POST
export async function GET() { ... }
export async function POST() { ... }

// AFTER: Keep only POST
export async function POST() { ... }
```

**Lines to delete:** Lines 1-189 (GET handler and helper functions)

**Helper functions to keep or move:**
- `generateSlug()` - Used by POST
- `generateUniqueSlug()` - Used by POST
- `validateCommandInputs()` - Used by POST
- `insertCommandWithRetry()` - Used by POST

**Helper functions to remove:**
- `parseQueryParams()` - Only used by GET
- `buildWhereConditions()` - Only used by GET
- `executeCommandsQuery()` - Only used by GET
- `getBookmarkedCommandIds()` - Only used by GET (consider moving to lib/db-queries)

---

### 4. `app/api/admin/commands/route.ts` - GET Handler

**Status:** ❌ No longer used  
**Previously used by:** `app/admin/commands/page.tsx` (now uses direct query)

**Action:** Can remove entire file (only has GET handler)

**File to delete:** `app/api/admin/commands/route.ts` (entire file)

---

### 5. `app/api/user/commands/route.ts` - GET Handler

**Status:** ❌ No longer used  
**Previously used by:** `app/submissions/page.tsx` (now uses direct query)

**Action:** Can remove entire file (only has GET handler)

**File to delete:** `app/api/user/commands/route.ts` (entire file)

---

## 📋 Cleanup Checklist

Follow this order to safely remove unused code:

### Phase 1: Verify No Usage (Do First)
- [ ] Search codebase for any remaining fetch calls to GET endpoints
- [ ] Check if any external services call these endpoints
- [ ] Verify all tests pass without these endpoints

### Phase 2: Remove Entire Files (Safest)
These files only contain GET handlers:

- [ ] Delete `app/api/commands/[slug]/route.ts`
- [ ] Delete `app/api/admin/commands/route.ts`
- [ ] Delete `app/api/user/commands/route.ts`

### Phase 3: Remove GET Handlers from Mixed Files
These files have both GET and mutation handlers:

- [ ] Remove GET handler from `app/api/bookmarks/route.ts` (keep POST/DELETE)
- [ ] Remove GET handler from `app/api/commands/route.ts` (keep POST)

### Phase 4: Clean Up Helper Functions
After removing GET handlers:

- [ ] Remove `parseQueryParams()` from `app/api/commands/route.ts`
- [ ] Remove `buildWhereConditions()` from `app/api/commands/route.ts`
- [ ] Remove `executeCommandsQuery()` from `app/api/commands/route.ts`
- [ ] Optionally move `getBookmarkedCommandIds()` to `lib/db-queries/bookmarks.ts` for reuse

### Phase 5: Verify
- [ ] Run type check: `pnpm run build --dry-run` or `tsc --noEmit`
- [ ] Run linter: `pnpm run lint`
- [ ] Test all pages still work
- [ ] Test all client component actions still work
- [ ] Check for any broken imports

---

## 📊 Impact Summary

### Files to Fully Delete (3 files)
1. `app/api/commands/[slug]/route.ts` (~110 lines)
2. `app/api/admin/commands/route.ts` (~50 lines)
3. `app/api/user/commands/route.ts` (~38 lines)

**Total:** ~198 lines removed

### Files to Partially Clean (2 files)
1. `app/api/bookmarks/route.ts` - Remove GET handler (~33 lines)
2. `app/api/commands/route.ts` - Remove GET handler + helpers (~125 lines)

**Total:** ~158 lines removed

### Overall Cleanup
- **~356 lines of code removed**
- **3 fewer route files to maintain**
- **5 fewer API endpoints to secure/test**
- **Simpler API surface area**

---

## ⚠️ Important Notes

### Don't Remove These!
Keep all mutation handlers (POST, PATCH, DELETE, PUT) as they're needed for client-side actions.

### External APIs
If any external services or webhooks call these GET endpoints, you'll need to:
1. Keep the endpoints, OR
2. Update external services to call new endpoints, OR
3. Create proxy endpoints if needed

### API Documentation
After cleanup:
- Update any API documentation
- Update OpenAPI/Swagger specs if used
- Update integration tests
- Notify team members of changes

---

## 🧪 Testing After Cleanup

Test these user flows:

1. **Bookmarks:**
   - [ ] Can add bookmark (uses POST /api/bookmarks)
   - [ ] Can remove bookmark (uses DELETE /api/bookmarks)
   - [ ] Favorites page shows bookmarks (uses direct query)

2. **Commands:**
   - [ ] Can submit command (uses POST /api/commands)
   - [ ] Commands listing shows filtered results (uses direct query)
   - [ ] Command detail page shows data (uses direct query)

3. **Admin:**
   - [ ] Can approve command (uses PATCH /api/admin/commands/[id]/approve)
   - [ ] Can reject command (uses PATCH /api/admin/commands/[id]/reject)
   - [ ] Admin page shows all statuses (uses direct query)

4. **User:**
   - [ ] Submissions page shows user commands (uses direct query)
   - [ ] Can complete onboarding (uses POST /api/user/profile)

---

## 🔒 Security Note

Removing GET endpoints doesn't reduce security requirements for remaining endpoints. All mutation handlers still need:
- ✅ Authentication checks
- ✅ Authorization checks
- ✅ Input validation
- ✅ Rate limiting
- ✅ CSRF protection

---

## 💡 Optional: Create Shared Helpers

Consider extracting common database query logic:

```typescript
// lib/db-queries/bookmarks.ts
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { eq } from 'drizzle-orm'

export async function getBookmarkedCommandIds(
  userId: string | null
): Promise<string[]> {
  if (!userId) return []
  
  const userBookmarks = await db
    .select({ commandId: bookmarks.commandId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
  
  return userBookmarks.map((b) => b.commandId)
}

export function addBookmarkFlags<T extends { id: string }>(
  items: T[],
  bookmarkedIds: string[]
): (T & { isBookmarked: boolean })[] {
  return items.map((item) => ({
    ...item,
    isBookmarked: bookmarkedIds.includes(item.id),
  }))
}
```

Then use in server components:
```typescript
import { getBookmarkedCommandIds, addBookmarkFlags } from '@/lib/db-queries/bookmarks'

const bookmarkedIds = await getBookmarkedCommandIds(userId)
const commandsWithBookmarks = addBookmarkFlags(results, bookmarkedIds)
```

This reduces duplication across the 3 pages that check bookmark status.

---

## ✅ Cleanup Complete

After following this guide:
- Cleaner, simpler API structure
- Fewer files to maintain
- Better separation between server/client data fetching
- Improved performance (already achieved with direct queries)
- Reduced attack surface
