<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { blur } from "svelte/transition"
  import { Trash, Pencil, ExternalLink } from "lucide-svelte"
  import DeleteDialog from "./DeleteDialog.svelte"
  import type { Bookmark } from "$lib/types"
  import { format } from "date-fns"
  import * as Table from "$lib/components/ui/table"

  export let bookmark: Bookmark

  let buttonGroup: HTMLElement
  let isDeleteDialogOpen = false
  let isEditDialogOpen = false
  let isOptionsOpen = false

  const handleDialogOpen = () => {
    isDeleteDialogOpen = true
  }
  const handleEditOpen = () => {
    isEditDialogOpen = true
  }
  const openButtonGroup = () => {
    isOptionsOpen = true
  }
  const closeButtonGroup = (e: MouseEvent) => {
    console.log(e)
    if (e.relatedTarget !== buttonGroup) {
      isOptionsOpen = false
    }
  }
</script>

<Table.Row class="relative">
  <!-- @TODO: Fix AlertDialog svg breaking bug -->
  <!-- <DeleteDialog bind:open={isDeleteDialogOpen} bookmarkId={bookmark.id} /> -->
  <Table.Cell class="font-medium">
    <img src={bookmark.image} alt="Bookmark Screenshot" class="size-12 rounded-md object-cover" />
  </Table.Cell>
  <Table.Cell>
    <div role="group" on:mouseleave={(e) => closeButtonGroup(e)} on:mouseenter={openButtonGroup}>
      <span>
        {bookmark.title}
      </span>
      <p class="line-clamp-2 break-words">{bookmark.desc}</p>
      <p class="text-sm text-muted">{bookmark.url}</p>
    </div>
  </Table.Cell>
  <Table.Cell title={bookmark.createdAt}>
    <div role="group" on:mouseleave={(e) => closeButtonGroup(e)} on:mouseenter={openButtonGroup}>
      <div>
        {format(bookmark.createdAt, "pp")}
      </div>
      <div>
        {format(bookmark.createdAt, "d MMM yyyy")}
      </div>
    </div>
  </Table.Cell>
  {#if isOptionsOpen}
    <div
      bind:this={buttonGroup}
      transition:blur
      class="absolute right-4 top-4 flex rounded-xl bg-zinc-200 bg-opacity-75 p-2 transition dark:bg-zinc-950"
    >
      <Button variant="ghost" size="icon" href={bookmark.url} target="_blank">
        <ExternalLink class="size-5" strokeWidth={1.5} />
      </Button>
      <Button variant="ghost" size="icon" on:click={handleEditOpen}>
        <Pencil class="size-5" strokeWidth={1.5} />
      </Button>
      <Button variant="ghost" size="icon" on:click={handleDialogOpen}>
        <Trash class="size-5" strokeWidth={1.5} color="#fca5a5" />
      </Button>
    </div>
  {/if}
</Table.Row>
