<script lang="ts">
  // import { page } from "$app/stores"
  import { cn } from "$lib/utils"
  import { format, startOfWeek } from "date-fns"
  // import * as Table from "$lib/components/ui/table"
  import { Badge } from "$lib/components/ui/badge"
  import { useInterface } from "$state/ui.svelte"
  import type { FeedEntry, FeedEntryMedia } from "$zod"

  const ui = useInterface()

  const { feedEntry } = $props<{ feedEntry: FeedEntry & { feedMedia: FeedEntryMedia[] } }>()

  let isDeleteDialogOpen = $state(false)
  let isOptionsOpen = $state(false)
  let card = $state<HTMLElement>()
  let cardOpen = $state(false)

  const handleDeleteDialogOpen = () => {
    isDeleteDialogOpen = true
  }
  const handleMetadataSidebarOpen = () => {
    // ui.setMetadataSidebarData({
    //   bookmark,
    //   categories: $page.data.categories,
    //   tags: $page.data.tags,
    // })
    // ui.toggleMetadataSidebar(true)
    // ui.toggleMetadataSidebarEditMode(false)
  }
  const openButtonGroup = () => {
    isOptionsOpen = true
  }
  const closeButtonGroup = () => {
    isOptionsOpen = false
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) return
    if (e.key === "\\" && e.target === card) {
      e.preventDefault()
      console.log("slash", feedEntry.title)
      cardOpen = !cardOpen
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div
  data-id="${feedEntry.id}"
  role="row"
  bind:this={card}
  tabindex="0"
  class="relative mx-4 grid grid-cols-[15rem_1fr] gap-4 rounded-lg rounded-l-none border-l-4 border-transparent p-4 hover:bg-zinc-100 focus:border-zinc-500 focus:outline-none dark:hover:bg-zinc-900 dark:focus-visible:bg-zinc-900"
  on:mouseleave={closeButtonGroup}
  on:mouseenter={openButtonGroup}
>
  {#await import("./DeleteDialog.svelte") then { default: DeleteDialog }}
    <svelte:component
      this={DeleteDialog}
      bind:open={isDeleteDialogOpen}
      bookmarkId={feedEntry.id}
    />
  {/await}
  <div class={cn("grid place-items-center", cardOpen ? "items-start" : "")}>
    <img src={feedEntry.feedMedia?.[0]?.href} alt="Feed Media" class="rounded-md object-cover" />
  </div>
  <div class="flex flex-col gap-2">
    <span class="line-clamp-1 text-clip text-xl font-bold">
      {feedEntry.title}
    </span>
    {#if cardOpen}
      <p class="">{@html feedEntry.content}</p>
    {:else}
      <p class="line-clamp-2">{@html feedEntry.contentSnippet}</p>
    {/if}
    <div class="flex items-center justify-start gap-2 text-sm text-muted">
      <div class="flex items-center justify-start gap-2">
        {#if feedEntry.link}
          <img
            src={`https://${new URL(feedEntry.link).hostname}/favicon.ico`}
            alt="URL Favicon"
            class="size-4 rounded-full"
          />
        {/if}
        <a target="_blank" href={feedEntry.link} class="line-clamp-1 text-clip">
          {feedEntry.link}
        </a>
      </div>
    </div>
    <span class="flex flex-wrap gap-2">
      <Badge variant="secondary">
        {format(feedEntry.createdAt, "H:mm d MMM yyyy")}
      </Badge>
      {#if feedEntry.categories}
        {#each feedEntry.categories as category}
          <Badge variant="outline">
            {category}
          </Badge>
        {/each}
      {/if}
    </span>
  </div>
  {#await import("./FeedActions.svelte") then { default: Actions }}
    <svelte:component
      this={Actions}
      {handleMetadataSidebarOpen}
      {handleDeleteDialogOpen}
      {isOptionsOpen}
      url={feedEntry.link ?? ""}
    />
  {/await}
</div>
