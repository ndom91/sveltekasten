<script lang="ts">
  import { Button, Card } from "flowbite-svelte"
  import type { Bookmark } from "$lib/types"
  import { Trash, Pencil } from "lucide-svelte"
  import DeleteDialog from "./DeleteDialog.svelte"
  import EditDialog from "./EditDialog.svelte"

  export let bookmark: Bookmark

  let isDeleteDialogOpen = false
  let isEditDialogOpen = false

  // @ts-expect-error
  const handleDialogOpen = (targetState) => {
    isDeleteDialogOpen = targetState
  }

  // @ts-expect-error
  const handleEditOpen = (targetState) => {
    isEditDialogOpen = targetState
  }

  const handleDelete = () => {
    console.log("Deleting..")
  }

  const handleEdit = () => {
    console.log("Submitting Edit..")
  }
</script>

<Card
  class={`flex flex-col bg-gradient-to-b to-current from-[${
    bookmark.metadata?.logo?.background_color.toLowerCase() || "#ccc"
  }]`}
>
  <div class="adaptive-glass">
    <div class="flex items-center justify-between">
      <span>
        {bookmark.title}
      </span>
      <div class="flex gap-2">
        <Button color="alternative" size="xs" on:click={() => handleEditOpen(true)}>
          <Pencil className="size-3" strokeWidth={1.5} />
        </Button>
        <Button color="alternative" size="xs" on:click={() => handleDialogOpen(true)}>
          <Trash className="size-3" strokeWidth={1.5} color="#fca5a5" />
        </Button>
      </div>
    </div>
    <div class="line-clamp-2 break-words">{bookmark.desc}</div>
  </div>
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
  <DeleteDialog open={isDeleteDialogOpen} on:close={handleDialogOpen} on:submit={handleDelete} />
  <EditDialog open={isEditDialogOpen} on:close={handleEditOpen} on:submit={handleEdit} {bookmark} />
</Card>
