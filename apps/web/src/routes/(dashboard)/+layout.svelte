<script lang="ts">
import { type Snippet, onMount, setContext } from "svelte"
import { toast } from "svelte-sonner"
import * as Tooltip from "$/lib/components/ui/tooltip"
import DragAdd from "$lib/components/DragAdd.svelte"
import Sidebar from "$lib/components/NavigationSidebar.svelte"
import { CommandBar } from "$lib/components/command-bar"
import { MetadataSidebar } from "$lib/components/metadata-sidebar"
import { postMessageTypes } from "$lib/constants"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { FeedEntriesService } from "$lib/state/feedEntries.svelte"
import { FeedsService } from "$lib/state/feeds.svelte"
import { defaultAISettings, useInterface } from "$lib/state/ui.svelte"

import { dev } from "$app/environment"
import { browser } from "$app/environment"
import { invalidateAll, onNavigate } from "$app/navigation"
import { page } from "$app/state"

const { children }: { children: Snippet } = $props()

const DISABLED_PATHS = ["/feeds", "/categories", "/tags", "/settings", "/"]
const metadataEnabled = $derived(() => !DISABLED_PATHS.includes(page.url.pathname))

const feedsService = new FeedsService(page.data.feeds.data)
const feedEntriesService = new FeedEntriesService(page.data.feedEntries.data)
const bookmarksService = new BookmarksService(page.data.bookmarks.data)

setContext(FeedsService, feedsService)
setContext(FeedEntriesService, feedEntriesService)
setContext(BookmarksService, bookmarksService)

// $effect(() => {
//   // Deal with invalidated and re-run 'Load' functions
//   if ($page.data.bookmarks.data.length) {
//     // Add newly created to state
//     if (!bookmarksService.find($page.data.bookmarks.data[0])) {
//       bookmarksService.add($page.data.bookmarks.data[0])
//     }
//
//     // Update any potentially changed bookmarks
//     $page.data.bookmarks.data.forEach((bk: LoadBookmarkFlatTags) => {
//       bookmarksService.update(bk)
//     })
//   }
// })

const ui = useInterface()

// Set current user preferences to store
ui.aiFeaturesPreferences = page.data.session?.user?.settings?.ai ?? defaultAISettings
ui.userSettings = page.data.session?.user?.settings?.personal ?? {}

// Global View transition
onNavigate((navigation) => {
  if (!document.startViewTransition) {
    return
  }

  return new Promise<void>((resolve) => {
    document.startViewTransition(async () => {
      resolve()
      await navigation.complete
    })
  })
})

onMount(() => {
  if (browser && "serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/service-worker.js", {
      type: dev ? "module" : "classic",
    })
  }

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.startMessages()
    navigator.serviceWorker.onmessage = async (event) => {
      if (event.data.type === postMessageTypes.SHARE_SUCCESS) {
        toast.success(event.data.payload.message)
        await invalidateAll()
      }
    }
  }
})
</script>

<div class="flex h-screen max-w-full">
  <CommandBar />
  <Sidebar />
  <div class="flex w-full min-w-0 flex-col">
    {@render children()}
  </div>
  {#if metadataEnabled()}
    <MetadataSidebar />
  {/if}
</div>

<DragAdd />
