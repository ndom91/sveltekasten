import "@auth/sveltekit"
import type { AIFeaturesPreferences } from "$lib/state/ui.svelte"
import type { Prisma } from "@prisma/client"
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
    error?: "RefreshAccessTokenError"
  }
}

declare global {
  type TODO = any

  type bk = Prisma.BookmarkGetPayload<object>

  export const bookmarksWithRelationships = Prisma.validator<Prisma.BookmarkDefaultArgs>()({
    include: { tags: { include: { tag: true } }, category: true },
  })
  type LoadBookmark = Prisma.BookmarkGetPayload<typeof bookmarksWithRelationships>
  type FlatTags = Prisma.TagGetPayload<object>
  type LoadBookmarkFlatTags = Omit<LoadBookmark, "tags"> & { tags: FlatTags[] } & { metadata: Record<string, string> }

  type LoadFeedEntry = Prisma.FeedEntryGetPayload<{
    include: { feed: true; feedMedia: true }
  }>
  type LoadFeed = Prisma.FeedGetPayload<object> & { visible: boolean }

  interface BookmarkContext {
    bookmarks: SvelteMap<string, LoadBookmarkFlatTags>
    add: (bookmark: LoadBookmarkFlatTags | LoadBookmarkFlatTags[]) => void
    remove: (bookmarkId: string) => void
    update: (bookmark: LoadBookmarkFlatTags) => void
    find: (bookmarkId: string) => LoadBookmarkFlatTags | undefined
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
