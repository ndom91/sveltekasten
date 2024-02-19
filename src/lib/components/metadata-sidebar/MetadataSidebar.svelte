<script lang="ts">
  import { cn } from "$lib/utils/style"
  import { page } from "$app/stores"
  import { useInterface } from "$state/ui.svelte"
  import BookmarkContent from "./BookmarkContent.svelte"
  import FeedContent from "./FeedContent.svelte"

  const ui = useInterface()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) return
    if (event.code === "BracketRight") {
      event.preventDefault()
      ui.toggleMetadataSidebar()
    }
  }

  const bookmarkPage = $derived($page.url.pathname === "/bookmarks")
  const feedPage = $derived($page.url.pathname === "/feeds")
</script>

<svelte:window on:keydown={handleKeyDown} />
<aside
  class={cn(
    "space-between relative flex h-screen flex-grow flex-col border-l bg-zinc-50 transition-width dark:border-l-zinc-800 dark:bg-zinc-900",
    ui.metadataSidebarOpen ? "display-block w-[clamp(10vw,_25rem,_35vw)]" : "display-none w-0",
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
