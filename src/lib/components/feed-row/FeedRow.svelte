<script lang="ts">
  // import { page } from "$app/stores"
  import { format } from "date-fns"
  import * as Table from "$lib/components/ui/table"
  import { Badge } from "$lib/components/ui/badge"
  import { useInterface } from "$state/ui.svelte"
  import type { FeedEntry } from "$zod"

  const ui = useInterface()

  const { feedEntry } = $props<{ feedEntry: FeedEntry }>()

  let isDeleteDialogOpen = $state(false)
  let isOptionsOpen = $state(false)

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
</script>

<Table.Row
  class="relative hover:bg-zinc-900"
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
  <Table.Cell class="w-48 font-medium">
    <img src={feedEntry.feedMedia?.[0]?.href} alt="Feed Media" class="rounded-md object-cover" />
  </Table.Cell>
  <Table.Cell class="flex flex-col gap-2">
    <span class="line-clamp-1 text-clip text-xl font-bold">
      {feedEntry.title}
    </span>
    <p class="line-clamp-3">{@html feedEntry.contentSnippet}</p>
    <div class="flex items-center justify-start gap-2 text-sm text-muted">
      <div class="flex items-center justify-start gap-2">
        {#if feedEntry.link}
          <img
            src={`https://${new URL(feedEntry.link).hostname}/favicon.ico`}
            alt="URL Favicon"
            class="size-4 rounded-full"
          />
        {/if}
        <a href={feedEntry.link} class="line-clamp-1 text-clip">
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
  </Table.Cell>
  <!-- <Table.Cell title={String(feedEntry.createdAt)}> -->
  <!--   <div> -->
  <!--     <div> -->
  <!--       {format(feedEntry.createdAt, "pp")} -->
  <!--     </div> -->
  <!--     <div> -->
  <!--       {format(feedEntry.createdAt, "d MMM yyyy")} -->
  <!--     </div> -->
  <!--   </div> -->
  <!-- </Table.Cell> -->
  {#await import("./FeedActions.svelte") then { default: Actions }}
    <svelte:component
      this={Actions}
      {handleMetadataSidebarOpen}
      {handleDeleteDialogOpen}
      {isOptionsOpen}
      url={feedEntry.url ?? ""}
    />
  {/await}
</Table.Row>
