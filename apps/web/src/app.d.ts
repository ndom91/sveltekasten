import "@auth/sveltekit"
import { Prisma } from "@prisma/client"
import type { BookmarkFlatTags } from "$lib/types"
import type { Tag, Bookmark, Tag, Category, JsonValueType } from "$lib/types/zod"
import type { AIFeaturesPreferences } from "./state/ui.svelte"

declare module "@auth/sveltekit" {
  interface User {
    settings: {
      ai: AIFeaturesPreferences
    }
  }
  interface Session {
    settings: {
      ai: AIFeaturesPreferences
    }
  }
}

type Provider = {
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
    include: { category: true; tags: { include: { tag: true } } }
  }>
  type LoadBookmarkFlatTags = BookmarkFlatTags
  type LoadFeedEntry = Prisma.FeedEntryGetPayload<{
    include: { feed: true; feedMedia: true }
  }>

  namespace App {
    interface Locals {
      providers: Provider[]
    }
    // interface Platform {}
    // interface PrivateEnv {}
    // interface PublicEnv {}
  }
}

declare module "@auth/sveltekit" {
  interface User {
    userId: string
  }
}

interface ViewTransition {
  updateCallbackDone: Promise<void>
  ready: Promise<void>
  finished: Promise<void>
  skipTransition: () => void
}

interface Document {
  startViewTransition(updateCallback: () => Promise<void>): ViewTransition
}
