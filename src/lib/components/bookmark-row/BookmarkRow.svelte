<script lang="ts">
  import type { Bookmark } from "$lib/types"
  import { format } from "date-fns"
  import * as Table from "$lib/components/ui/table"
  import { createUI } from "$state/ui.svelte"

  const ui = createUI()

  export let bookmark: Bookmark

  let isDeleteDialogOpen = false
  let isEditDialogOpen = false
  let isOptionsOpen = false

  const handleDeleteDialogOpen = () => {
    isDeleteDialogOpen = true
  }
  const handleEditDialogOpen = () => {
    isEditDialogOpen = true
    ui.setMetadataSidebarData(bookmark)
    ui.toggleMetadataSidebar(true)
  }
  const openButtonGroup = () => {
    isOptionsOpen = true
  }
  const closeButtonGroup = (e: MouseEvent) => {
    isOptionsOpen = false
  }

  export const ssr = false
</script>

<Table.Row
  class="relative"
  on:mouseleave={(e) => closeButtonGroup(e)}
  on:mouseenter={openButtonGroup}
>
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
      {#if bookmark.metadata.logo?.url}
        <img src={bookmark.metadata.logo.url} alt="URL Favicon" class="size-4 rounded-full" />
      {/if}
      {bookmark.url}
    </p>
  </Table.Cell>
  <Table.Cell title={bookmark.createdAt}>
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
