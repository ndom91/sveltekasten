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
  <Table.Cell class="font-medium">
    <img src={feedEntry.feedMedia?.[0]?.href} alt="Feed Media" class="rounded-md object-cover" />
  </Table.Cell>
  <Table.Cell>
    <span>
      {feedEntry.title}
    </span>
    <p class="line-clamp-4 max-w-[70vw]">{@html feedEntry.description}</p>
    <p class="flex items-center justify-start gap-2 text-sm text-muted">
      {#if feedEntry.metadata?.logo?.url}
        <img src={feedEntry.metadata?.logo?.url} alt="URL Favicon" class="size-4 rounded-full" />
      {/if}
      <span>
        {feedEntry.feed.url}
      </span>
      {#if feedEntry.category?.name}
        <Badge color="blue">
          {feedEntry.category?.name}
        </Badge>
      {/if}
    </p>
  </Table.Cell>
  <Table.Cell title={String(feedEntry.createdAt)}>
    <div>
      <div>
        {format(feedEntry.createdAt, "pp")}
      </div>
      <div>
        {format(feedEntry.createdAt, "d MMM yyyy")}
      </div>
    </div>
  </Table.Cell>
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
