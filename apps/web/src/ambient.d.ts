import "@auth/sveltekit"
import type { Prisma } from "@prisma/client"
import type { AIFeaturesPreferences } from "./state/ui.svelte"
import type { BookmarkFlatTags } from "$lib/types"
import type { SvelteMap } from "svelte"

declare module "@auth/sveltekit" {
  interface User {
    id: string
    settings?: {
      ai?: AIFeaturesPreferences
      personal?: Record<string, unknown>
    }
  }
  interface Session {
    user: User
    error?: "RefreshAccessTokenError"
  }
  interface JWT {
    access_token?: string
    expires_at?: number
    refresh_token?: string
    providerId?: string
    error?: "RefreshAccessTokenError"
  }
}

declare global {
  type TODO = any

  type bk = Prisma.BookmarkGetPayload<object>

  type LoadBookmark = Prisma.BookmarkGetPayload<{
    include: { category: true; tags: { include: { tag: true } } }
  }>
  type LoadBookmarkFlatTags = BookmarkFlatTags
  type LoadFeedEntry = Prisma.FeedEntryGetPayload<{
    include: { feed: true; feedMedia: true }
  }>
  type LoadFeed = Prisma.FeedGetPayload<object> & { visible: boolean }

  interface BookmarkContext {
    bookmarks: SvelteMap<string, BookmarkFlatTags>
    add: (bookmark: BookmarkFlatTags | BookmarkFlatTags[]) => void
    remove: (bookmarkId: string) => void
    update: (bookmark: BookmarkFlatTags) => void
    find: (bookmarkId: string) => BookmarkFlatTags | undefined
  }

  declare const __DATE__: string
  declare const __RELOAD_SW__: boolean

  interface ViewTransition {
    updateCallbackDone: Promise<void>
    ready: Promise<void>
    finished: Promise<void>
    skipTransition: () => void
  }

  interface Document {
    startViewTransition: (updateCallback: () => Promise<void>) => ViewTransition
  }
}
