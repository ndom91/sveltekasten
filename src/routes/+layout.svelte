<script lang="ts">
  import { Toaster } from "svelte-french-toast"
  import { onNavigate } from "$app/navigation"
  import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
  import "$lib/styles/style.css"

  // View transition
  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })

  let showKeyboardShortcuts = $state(false)

  const handleKeyDown = (e) => {
    if (e.repeat || e.target instanceof HTMLInputElement) return
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault()
      showKeyboardShortcuts = !showKeyboardShortcuts
    }
  }
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

{#if showKeyboardShortcuts}
  <KeyboardShortcutsHelp bind:open={showKeyboardShortcuts} />
{/if}
<Toaster />
<slot />
