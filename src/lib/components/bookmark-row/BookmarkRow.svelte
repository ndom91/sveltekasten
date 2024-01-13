<script lang="ts">
  import { page } from "$app/stores"
  import { format } from "date-fns"
  import * as Table from "$lib/components/ui/table"
  import { Badge } from "$lib/components/ui/badge"
  import { useInterface } from "$state/ui.svelte"
  import type { Bookmark, Tag, Category } from "$zod"

  const ui = useInterface()

  const { bookmark } = $props<{ bookmark: Bookmark & { tags: { tag: Tag }[] } & { category: Category } }>()

  let isDeleteDialogOpen = $state(false)
  let isOptionsOpen = $state(false)

  const handleDeleteDialogOpen = () => {
    isDeleteDialogOpen = true
  }
  const handleMetadataSidebarOpen = () => {
    ui.setMetadataSidebarData({
      // @ts-expect-error
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
      {#if bookmark.metadata?.logo}
        <img src={bookmark.metadata?.logo} alt="URL Favicon" class="size-4 rounded-full" />
      {/if}
      <span>
        {bookmark.url}
      </span>
    </div>
    <span class="flex flex-wrap gap-2">
      <Badge variant="default">
        {format(bookmark.createdAt, "H:mm - d MMM yyyy")}
      </Badge>
      {#if bookmark.category?.name}
        <Badge variant="secondary">
          {bookmark.category.name}
        </Badge>
      {/if}
      {#if bookmark.tags.length}
        <span class="flex flex-wrap gap-2">
          {#each bookmark.tags as tag}
            <Badge variant="outline">
              {tag.tag.name}
              {tag.tag.emoji}
            </Badge>
          {/each}
        </span>
      {/if}
    </span>
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
