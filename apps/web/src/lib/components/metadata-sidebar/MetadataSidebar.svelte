<script lang="ts">
  import BookmarkContent from "./BookmarkContent.svelte"
  import FeedContent from "./FeedContent.svelte"
  import { useInterface } from "$lib/state/ui.svelte"
  import { cn } from "$lib/utils/style"
  import { page } from "$app/stores"

  const ui = useInterface()
  let metadataSidebarElement = $state<HTMLElement>()!

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) {
      return
    }
    if (event.code === "BracketRight") {
      event.preventDefault()
      ui.toggleMetadataSidebar()
    }
  }

  const bookmarkPage = $derived(
    $page.url.pathname === "/bookmarks" || $page.url.pathname === "/archives",
  )
  const feedPage = $derived($page.url.pathname === "/feeds")

  const mutate = () => {
    if (ui.metadataSidebarOpen) {
      metadataSidebarElement.style.width = "18rem"
    } else {
      metadataSidebarElement.style.width = "0rem"
    }
  }

  $effect(() => {
    // Hack to get effect to run on sidebar toggle
    ui.metadataSidebarOpen
    document.startViewTransition ? document.startViewTransition(() => mutate()) : mutate()
  })
</script>

<svelte:window onkeydown={handleKeyDown} />

<aside
  bind:this={metadataSidebarElement}
  class={cn(
    "space-between relative flex h-screen flex-shrink-0 flex-col border-l bg-neutral-50 transition-all dark:border-l-zinc-800 dark:bg-neutral-900",
  )}
>
  {#if ui.metadataSidebarOpen}
    {#if bookmarkPage}
      <BookmarkContent />
    {:else if feedPage}
      <FeedContent />
    {/if}
  {/if}
</aside>
