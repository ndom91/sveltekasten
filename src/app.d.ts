import type { Bookmark, Tag, Category } from "$zod"
import "@auth/sveltekit"
import type { JsonValueType } from "$zod"

declare module "@auth/sveltekit/jwt" {
  interface JWT {
    idToken?: string
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
  type LoadBookmarkResult = Bookmark & { metadata: Record<string, any> | JsonValueType } & {
    tags: Tag[]
  } & { category: Category | null }
  type LoadFeedEntry = FeedEntry & { feed: Feed; feedMedia: FeedEntryMedia | null }

  namespace App {
    interface Locals {
      providers: Provider[]
      test: string
    }
    // interface Platform {}
    // interface PrivateEnv {}
    // interface PublicEnv {}
  }
}

// Requires @auth/sveltekit@0.5.1+
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
