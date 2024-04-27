<script lang="ts">
  import { Toaster } from "svelte-french-toast"
  // import { Toaster } from "$lib/components/ui/sonner"

  import { partytownSnippet } from "@builder.io/partytown/integration"
  import { type Snippet, onMount } from "svelte"

  import DragAdd from "./DragAdd.svelte"
  import type { LayoutData } from "./$types"
  import { page } from "$app/stores"
  import { dev } from "$app/environment"
  import { goto, onNavigate } from "$app/navigation"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"

  import "$lib/styles/global.css"

  const ui = useInterface()

  const { data, children }: { data: LayoutData, children: Snippet } = $props()

  // Set current user preferences to store
  ui.aiFeaturesPreferences = data.session?.user?.settings.ai ?? defaultAISettings

  // Global View transition
  onNavigate((navigation) => {
    // @ts-expect-error New method, only available in Chromium
    if (!document.startViewTransition)
      return

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
    if (e.repeat || e.target instanceof HTMLInputElement)
      return
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

  let scriptTag: HTMLScriptElement
  onMount(() => {
    // eslint-disable-next-line svelte/valid-compile
    if (!dev && $page.url.hostname === "dev.briefkastenhq.com")
      scriptTag.textContent = partytownSnippet()
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
  position="bottom-right"
  toastOptions={{ style: "background-color: #11111175; padding: 12px; color: #fff; backdrop-filter: blur(8px);" }}
/>

{@render children()}

<DragAdd />
