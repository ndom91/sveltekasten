<script lang="ts">
  import { page } from "$app/stores"
  import { toast } from "svelte-sonner"
  import DragAdd from "./DragAdd.svelte"
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import { MetadataSidebar } from "$/lib/components/metadata-sidebar"
  import { CommandBar } from "$lib/components/command-bar"
  import { dev } from "$app/environment"
  import { type Snippet, onMount, setContext } from "svelte"
  import { postMessageTypes } from "$lib/constants"

  import { invalidateAll, onNavigate } from "$app/navigation"
  import { browser } from "$app/environment"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import { useBookmarks } from "$state/bookmarks.svelte"

  const { children }: { children: Snippet } = $props()

  const DISABLED_PATHS = ["/feeds", "/categories", "/tags", "/settings", "/"]
  const metadataEnabled = $derived(() => !DISABLED_PATHS.includes($page.url.pathname))

  const bookmarkStore = useBookmarks()
  setContext("bookmarks", bookmarkStore)

  const ui = useInterface()

  // Set current user preferences to store
  ui.aiFeaturesPreferences = $page.data.session?.user?.settings?.ai ?? defaultAISettings
  ui.userSettings = $page.data.session?.user?.settings?.personal ?? {}

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
      navigator.serviceWorker.register("/service-worker.js", {
        type: dev ? "module" : "classic",
      })
    }

    if (navigator.serviceWorker.controller) {
      console.log("This page is currently controlled by:", navigator.serviceWorker.controller)
      navigator.serviceWorker.startMessages()
      navigator.serviceWorker.onmessage = (event) => {
        if (event.data.type === postMessageTypes.SHARE_SUCCESS) {
          toast.success(event.data.payload.message)
          invalidateAll()
        }
      }
    }
  })
</script>

<div class="flex overflow-hidden h-full">
  <CommandBar />
  <Sidebar />
  <div class="flex flex-col min-h-full transition duration-300 translate-x-0 flex-grow-[9]">
    {@render children()}
  </div>
  {#if metadataEnabled()}
    <MetadataSidebar />
  {/if}
</div>

<DragAdd />
