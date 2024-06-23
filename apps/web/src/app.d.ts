import "@auth/sveltekit"
import "vite-plugin-pwa/pwa-assets"
import "vite-plugin-pwa/svelte"
import "vite-plugin-pwa/info"
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

declare module "virtual:pwa-register" {
  import type { RegisterSWOptions } from "vite-plugin-pwa/types"

  export type { RegisterSWOptions }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
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
    bookmarks: BookmarkFlatTags[]
    add: (bookmark: BookmarkFlatTags | BookmarkFlatTags[]) => void
    remove: (bookmarkId: string) => void
    update: (bookmark: BookmarkFlatTags) => void
    find: (bookmarkId: string) => BookmarkFlatTags | undefined
  }

  declare const __DATE__: string
  declare const __RELOAD_SW__: boolean

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
