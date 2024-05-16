import "@auth/sveltekit"
import type { Prisma } from "@prisma/client"
import type { AIFeaturesPreferences } from "./state/ui.svelte"
import type { BookmarkFlatTags } from "$lib/types"

declare module "@auth/sveltekit" {
  interface User {
    id: string
    settings?: {
      ai?: AIFeaturesPreferences
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

interface Provider {
  id: string
  name: string
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
  type TODO = any

  type bk = Prisma.BookmarkGetPayload<{}>

  type LoadBookmark = Prisma.BookmarkGetPayload<{
    include: { category: true, tags: { include: { tag: true } } }
  }>
  type LoadBookmarkFlatTags = BookmarkFlatTags
  type LoadFeedEntry = Prisma.FeedEntryGetPayload<{
    include: { feed: true, feedMedia: true }
  }>
  type LoadFeed = Prisma.FeedGetPayload<{}> & { visible: boolean }

  interface BookmarkContext {
    bookmarks: BookmarkFlatTags[]
    add: (bookmark: BookmarkFlatTags | BookmarkFlatTags[]) => void
    remove: (bookmarkId: string) => void
    update: (bookmark: BookmarkFlatTags) => void
    find: (bookmarkId: string) => BookmarkFlatTags | undefined
  }

  namespace App {
    interface Locals {
      providers: Provider[]
    }
    // interface Platform {}
    // interface PrivateEnv {}
    // interface PublicEnv {}
  }
}

interface ViewTransition {
  updateCallbackDone: Promise<void>
  ready: Promise<void>
  finished: Promise<void>
  skipTransition: () => void
}

interface Document {
  startViewTransition: (updateCallback: () => Promise<void>) => ViewTransition
}
