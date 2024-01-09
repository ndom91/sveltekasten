<script lang="ts">
  import { page } from "$app/stores"
  import { format } from "date-fns"
  import * as Table from "$lib/components/ui/table"
  import { Badge } from "$lib/components/ui/badge"
  import { useInterface } from "$state/ui.svelte"
  import type { Bookmark } from "$zod"

  const ui = useInterface()

  const { bookmark } = $props<{ bookmark: Bookmark }>()

  let isDeleteDialogOpen = $state(false)
  let isOptionsOpen = $state(false)

  const handleDeleteDialogOpen = () => {
    isDeleteDialogOpen = true
  }
  const handleMetadataSidebarOpen = () => {
    ui.setMetadataSidebarData({
      bookmark,
      categories: $page.data.categories,
      tags: $page.data.tags,
    })
    ui.toggleMetadataSidebar(true)
    ui.toggleMetadataSidebarEditMode(false)
  }
  const openButtonGroup = () => {
    isOptionsOpen = true
  }
  const closeButtonGroup = () => {
    isOptionsOpen = false
  }
  console.log(JSON.stringify(bookmark.tags))
</script>

<Table.Row
  class="relative hover:bg-zinc-100 dark:hover:bg-zinc-900"
  on:mouseleave={closeButtonGroup}
  on:mouseenter={openButtonGroup}
>
  {#await import("./DeleteDialog.svelte") then { default: DeleteDialog }}
    <svelte:component this={DeleteDialog} bind:open={isDeleteDialogOpen} bookmarkId={bookmark.id} />
  {/await}
  <Table.Cell class="w-32 font-medium">
    <img src={bookmark.image} alt="Bookmark Screenshot" class="mx-auto rounded-md object-cover" />
  </Table.Cell>
  <Table.Cell class="flex flex-col gap-2">
    <span class="line-clamp-1 text-clip text-xl font-bold">
      {bookmark.title}
    </span>
    <p class="line-clamp-2 break-words">{bookmark.desc}</p>
    <div class="flex items-center justify-start gap-2 text-sm text-muted">
      {#if bookmark.metadata?.logo?.url}
        <img src={bookmark.metadata?.logo?.url} alt="URL Favicon" class="size-4 rounded-full" />
      {/if}
      <span>
        {bookmark.url}
      </span>
    </div>
    <span class="flex flex-wrap gap-2">
      <Badge variant="secondary">
        {format(bookmark.createdAt, "H:mm - d MMM yyyy")}
      </Badge>
      {#if bookmark.category?.name}
        <Badge variant="outline">
          {bookmark.category.name}
        </Badge>
      {/if}
    </span>
    {#if bookmark.tags.length}
      <span class="flex flex-wrap gap-2">
        {#each bookmark.tags as tag}
          <Badge variant="default">
            {tag.name}
          </Badge>
        {/each}
      </span>
    {/if}
  </Table.Cell>
  {#await import("./BookmarkActions.svelte") then { default: Actions }}
    <svelte:component
      this={Actions}
      {handleMetadataSidebarOpen}
      {handleDeleteDialogOpen}
      {isOptionsOpen}
      url={bookmark.url ?? ""}
    />
  {/await}
</Table.Row>
