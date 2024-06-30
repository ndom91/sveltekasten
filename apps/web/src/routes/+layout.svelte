<script lang="ts">
  import { type Snippet } from "svelte"
  import { setContext } from "svelte"
  import { Toaster, toast } from "svelte-sonner"
  import DragAdd from "./DragAdd.svelte"
  import Scripts from "./Scripts.svelte"
  import Shortcuts from "./GlobalShortcuts.svelte"
  import type { LayoutData } from "./$types"
  import { browser } from "$app/environment"

  import { onNavigate } from "$app/navigation"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import { useBookmarks } from "$state/bookmarks.svelte"

  const bookmarkStore = useBookmarks()
  setContext("bookmarks", bookmarkStore)

  import "$lib/styles/global.css"

  const ui = useInterface()

  const { data, children }: { data: LayoutData; children: Snippet } = $props()

  // Share Target Redirect
  const urlParams = new URLSearchParams(window.location.search);
  const sharedSuccess = urlParams.get('shared')
  if (sharedSuccess === "true") {
    toast.success('Link saved!')
  }

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

  if (browser && navigator.serviceWorker.controller) {
    console.log("This page is currently controlled by:", navigator.serviceWorker.controller)

    navigator.serviceWorker.onmessage = (event) => {
      console.log(event.data.msg, event.data.url)
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
