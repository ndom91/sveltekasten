<script lang="ts">
  import { Toaster } from "svelte-french-toast"
  // import { Toaster } from "$lib/components/ui/sonner"
  import { goto, onNavigate } from "$app/navigation"
  import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
  import "$lib/styles/global.css"

  // View transition
  onNavigate((navigation) => {
    // @ts-expect-error New method, only available in Chromium
    if (!document.startViewTransition) return

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
    if (e.repeat || e.target instanceof HTMLInputElement) return
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
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

{#if showKeyboardShortcuts}
  <KeyboardShortcutsHelp bind:open={showKeyboardShortcuts} />
{/if}
<Toaster
  position="bottom-right"
  toastOptions={{ style: "background-color: #111111; color: #fff" }}
/>
<slot />
