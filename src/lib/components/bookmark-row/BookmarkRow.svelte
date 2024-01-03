<script lang="ts">
  import { format } from "date-fns"
  import * as Table from "$lib/components/ui/table"
  import { useInterface } from "$state/ui.svelte"
  import type { Bookmark } from "$zod"

  const ui = useInterface()

  const { bookmark } = $props<{ bookmark: Bookmark }>()

  let isDeleteDialogOpen = $state(false)
  let isEditDialogOpen = $state(false)
  let isOptionsOpen = $state(false)

  const handleDeleteDialogOpen = () => {
    isDeleteDialogOpen = true
  }
  const handleEditDialogOpen = () => {
    isEditDialogOpen = true
    ui.setMetadataSidebarData(bookmark)
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

<Table.Row class="relative" on:mouseleave={closeButtonGroup} on:mouseenter={openButtonGroup}>
  {#await import("./DeleteDialog.svelte") then { default: DeleteDialog }}
    <svelte:component this={DeleteDialog} bind:open={isDeleteDialogOpen} bookmarkId={bookmark.id} />
  {/await}
  <Table.Cell class="font-medium">
    <img src={bookmark.image} alt="Bookmark Screenshot" class="size-12 rounded-md object-cover" />
  </Table.Cell>
  <Table.Cell>
    <span>
      {bookmark.title}
    </span>
    <p class="line-clamp-2 break-words">{bookmark.desc}</p>
    <p class="flex items-center justify-start gap-2 text-sm text-muted">
      {#if bookmark.metadata?.logo?.url}
        <img src={bookmark.metadata?.logo?.url} alt="URL Favicon" class="size-4 rounded-full" />
      {/if}
      {bookmark.url}
    </p>
  </Table.Cell>
  <Table.Cell title={String(bookmark.createdAt)}>
    <div>
      <div>
        {format(bookmark.createdAt, "pp")}
      </div>
      <div>
        {format(bookmark.createdAt, "d MMM yyyy")}
      </div>
    </div>
  </Table.Cell>
  {#await import("./BookmarkActions.svelte") then { default: Actions }}
    <svelte:component
      this={Actions}
      {handleEditDialogOpen}
      {handleDeleteDialogOpen}
      {isOptionsOpen}
      url={bookmark.url ?? ""}
    />
  {/await}
</Table.Row>
