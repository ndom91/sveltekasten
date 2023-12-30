<script lang="ts">
  import { Button, Card } from "flowbite-svelte"
  import type { Bookmark } from "$lib/types"
  import { Trash, Pencil } from "lucide-svelte"
  import DeleteDialog from "./DeleteDialog.svelte"
  import EditDialog from "./EditDialog.svelte"

  export let bookmark: Bookmark

  let isDeleteDialogOpen = false
  let isEditDialogOpen = false

  const handleDialogOpen = () => {
    isDeleteDialogOpen = true
  }

  const handleEditOpen = () => {
    isEditDialogOpen = true
  }

  const handleDelete = () => {
    console.log("Deleting..")
    isDeleteDialogOpen = false
  }

  const handleEdit = () => {
    console.log("Submitting Edit..")
    isEditDialogOpen = false
    // TODO: Submit Edit
    // and toast on success
  }
</script>

<Card
  class={`flex gap-4 flex-col bg-gradient-to-b to-current from-[${
    bookmark.metadata?.logo?.background_color.toLowerCase() || "#ccc"
  }]`}
>
  <div class="flex items-center justify-between">
    <span>
      {bookmark.title}
    </span>
    <div class="flex gap-2">
      <Button color="alternative" size="xs" on:click={handleEditOpen}>
        <Pencil className="size-3" strokeWidth={1.5} />
      </Button>
      <Button color="alternative" size="xs" on:click={handleDialogOpen}>
        <Trash className="size-3" strokeWidth={1.5} color="#fca5a5" />
      </Button>
    </div>
  </div>
  <div class="line-clamp-2 break-words">{bookmark.desc}</div>
  <div class="flex-grow">
    <img
      src={bookmark.image}
      alt="Bookmark Screenshot"
      class="aspect-video h-full w-full rounded-md object-cover"
    />
  </div>
  <div>
    <p>{bookmark.url}</p>
  </div>
  <DeleteDialog bind:open={isDeleteDialogOpen} on:submit={handleDelete} />
  <EditDialog bind:open={isEditDialogOpen} on:submit={handleEdit} {bookmark} />
</Card>
