<script lang="ts">
  import { cn } from "$lib/utils/style"
  import { page } from "$app/stores"
  import { useInterface } from "$state/ui.svelte"
  import BookmarkContent from "./BookmarkContent.svelte"
  import FeedContent from "./FeedContent.svelte"

  const ui = useInterface()

  const DISABLED_PATHS = ["/categories", "/tags"]

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) return
    if (event.code === "BracketRight") {
      if (DISABLED_PATHS.includes($page.url.pathname)) return
      event.preventDefault()
      ui.toggleMetadataSidebar()
    }
  }

  const bookmarkPage = $derived($page.url.pathname === "/bookmarks")
  const feedPage = $derived($page.url.pathname === "/feeds")
</script>

<svelte:window onkeydown={handleKeyDown} />
<aside
  class={cn(
    "space-between relative flex h-screen flex-shrink-0 flex-col border-l bg-zinc-50 transition-width dark:border-l-zinc-800 dark:bg-zinc-900",
    ui.metadataSidebarOpen ? "basis-72" : "w-0",
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
