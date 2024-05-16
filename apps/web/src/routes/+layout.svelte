<script lang="ts">
  import { partytownSnippet } from "@builder.io/partytown/integration"
  import { type Snippet, onMount } from "svelte"
  import { setContext } from "svelte"
  import { Toaster } from "svelte-sonner"
  import DragAdd from "./DragAdd.svelte"
  import type { LayoutData } from "./$types"

  import { page } from "$app/stores"
  import { dev } from "$app/environment"
  import { goto, onNavigate } from "$app/navigation"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
  import { useBookmarks } from "$state/bookmarks.svelte"

  const bookmarkStore = useBookmarks()
  setContext("bookmarks", bookmarkStore)

  import "$lib/styles/global.css"

  const ui = useInterface()

  const { data, children }: { data: LayoutData, children: Snippet } = $props()

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

  let showKeyboardShortcuts = $state(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) {
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault()
      showKeyboardShortcuts = !showKeyboardShortcuts
    }
    if (e.shiftKey && e.key === "!") {
      e.preventDefault()
      goto("/")
    }
    if (e.shiftKey && e.key === "@") {
      e.preventDefault()
      goto("/bookmarks")
    }
    if (e.shiftKey && e.key === "#") {
      e.preventDefault()
      goto("/feeds")
    }
    if (e.shiftKey && e.key === "$") {
      e.preventDefault()
      goto("/archives")
    }
    if (e.shiftKey && e.key === "%") {
      e.preventDefault()
      goto("/categories")
    }
    if (e.shiftKey && e.key === "^") {
      e.preventDefault()
      goto("/tags")
    }
    if (e.shiftKey && e.key === "&") {
      e.preventDefault()
      goto("/settings")
    }
  }

  // Set partykit script content
  let scriptTag: HTMLScriptElement
  onMount(() => {
    // eslint-disable-next-line svelte/valid-compile
    if (!dev && $page.url.hostname === "dev.briefkastenhq.com") {
      scriptTag.textContent = partytownSnippet()
    }
  })
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
  <script bind:this={scriptTag}></script>
  <!-- eslint-disable-next-line svelte/valid-compile -->
  {#if !dev && $page.url.hostname === "dev.briefkastenhq.com"}
    <script>
      partytown = {
      forward: ["plausible"],
      }
    </script>

    <script
      type="text/partytown"
      src="/p.js"
      data-domain="dev.briefkastenhq.com"
      data-api="/add/event"
    ></script>
  {/if}
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

{#if showKeyboardShortcuts}
  <KeyboardShortcutsHelp bind:open={showKeyboardShortcuts} />
{/if}

<Toaster
  class="toaster group"
  toastOptions={{
    class:
      "bg-white/20 backdrop-blur-md dark:bg-neutral-700/20 dark:text-white dark:border-gray-400/10 border border-gray-200/70",
  }}
/>

{@render children()}

<DragAdd />
