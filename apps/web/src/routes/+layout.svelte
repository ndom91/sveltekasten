<script lang="ts">
  import { type Snippet } from "svelte"
  import { setContext } from "svelte"
  import { Toaster } from "svelte-sonner"
  import { pwaInfo } from "virtual:pwa-info"
  // import { pwaAssetsHead } from "virtual:pwa-assets/head"
  import DragAdd from "./DragAdd.svelte"
  import Scripts from "./Scripts.svelte"
  import Shortcuts from "./GlobalShortcuts.svelte"
  import type { LayoutData } from "./$types"
  import { browser } from "$app/environment"

  import { onNavigate } from "$app/navigation"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import { useBookmarks } from "$state/bookmarks.svelte"

  const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "")

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

  if (browser && navigator.serviceWorker.controller) {
    console.log("This page is currently controlled by:", navigator.serviceWorker.controller)

    navigator.serviceWorker.onmessage = (event) => {
      console.log(event.data.msg, event.data.url)
    }
  }
</script>

<svelte:head>
  <title>BriefButler</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
  <!-- {#if pwaAssetsHead.themeColor}
    <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
  {/if}
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each} -->
  {@html webManifestLink}
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

{#await import("$lib/components/ReloadPrompt.svelte") then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
