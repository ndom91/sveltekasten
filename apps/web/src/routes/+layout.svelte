<script lang="ts">
  import { Toaster, toast } from "svelte-sonner"
  import { type Snippet, onMount, setContext } from "svelte"
  import DragAdd from "./DragAdd.svelte"
  import Scripts from "./Scripts.svelte"
  import Shortcuts from "./GlobalShortcuts.svelte"
  import type { LayoutData } from "./$types"

  import { onNavigate } from "$app/navigation"
  import { browser } from "$app/environment"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import { useBookmarks } from "$state/bookmarks.svelte"
  import "$lib/styles/global.css"

  const bookmarkStore = useBookmarks()
  setContext("bookmarks", bookmarkStore)

  const ui = useInterface()

  const { data, children }: { data: LayoutData; children: Snippet } = $props()

  // Set current user preferences to store
  ui.aiFeaturesPreferences = data.session?.user?.settings?.ai ?? defaultAISettings

  // Global View transition
  onNavigate((navigation) => {
    // @ts-expect-error New method, only available in Chromium
    if (!document.startViewTransition) {
      return
    }

    return new Promise((resolve) => {
      // @ts-expect-error New method, only available in Chromium
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })

  onMount(() => {
    if (browser && navigator.serviceWorker.controller) {
      console.log("This page is currently controlled by:", navigator.serviceWorker.controller)
      navigator.serviceWorker.startMessages()

      navigator.serviceWorker.onmessage = (event) => {
        toast.success(`sw.message: ${event.data}`)
        console.log("sw.message:", event.data)
      }
    }

    if (browser && "serviceWorker" in navigator) {
      navigator.serviceWorker.register(
        // @ts-expect-error - its fine, we're not transpiling to cjs
        import.meta.env.MODE === "production" ? "/service-worker.js" : "/dev-sw.js?dev-sw",
        // @ts-expect-error - its fine, we're not transpiling to cjs
        { type: import.meta.env.MODE === "production" ? "classic" : "module" },
      )
    }
  })
</script>

<svelte:head>
  <title>BriefButler</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Scripts />

<Shortcuts />

<Toaster
  class="toaster group"
  toastOptions={{
    class:
      "bg-white/20 backdrop-blur-md dark:bg-neutral-700/20 dark:text-white dark:border-gray-400/10 border border-gray-200/70",
  }}
/>

{@render children()}

<DragAdd />
