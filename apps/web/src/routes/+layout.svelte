<script lang="ts">
  import { type Snippet } from "svelte"
  import { setContext } from "svelte"
  import { Toaster } from "svelte-sonner"
  import DragAdd from "./DragAdd.svelte"
  import Scripts from "./Scripts.svelte"
  import Shortcuts from "./Shortcuts.svelte"
  import type { LayoutData } from "./$types"

  import { onNavigate } from "$app/navigation"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import { useBookmarks } from "$state/bookmarks.svelte"

  const bookmarkStore = useBookmarks()
  setContext("bookmarks", bookmarkStore)

  import "$lib/styles/global.css"

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
</script>

<svelte:head>
  <title>Briefkasten</title>
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
