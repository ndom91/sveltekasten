<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import { AspectRatio } from "$lib/components/ui/aspect-ratio"

  import { Button } from "$lib/components/ui/button"
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
  }

  const handleEdit = () => {
    console.log("Submitting Edit..")
  }
</script>

<Card.Root
  class={`flex flex-col bg-gradient-to-b to-current from-[${
    bookmark.metadata?.logo?.background_color.toLowerCase() || "#ccc"
  }]`}
>
  <Card.Header class="adaptive-glass">
    <div class="">
      <Card.Title class="flex items-center justify-between">
        <span>
          {bookmark.title}
        </span>
        <div class="flex">
          <Button variant="ghost" size="icon" on:click={handleEditOpen}>
            <Pencil className="size-4" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" on:click={handleDialogOpen}>
            <Trash className="size-4" strokeWidth={1.5} color="#fca5a5" />
          </Button>
        </div>
      </Card.Title>
      <Card.Description class="line-clamp-2 break-words">{bookmark.desc}</Card.Description>
    </div>
  </Card.Header>
  <Card.Content class="flex-grow">
    <AspectRatio ratio={16 / 9} class="rounded-md bg-muted">
      <img
        src={bookmark.image}
        alt="Bookmark Screenshot"
        class="h-full w-full rounded-md object-cover"
      />
    </AspectRatio>
  </Card.Content>
  <Card.Footer>
    <p>{bookmark.url}</p>
  </Card.Footer>
  <DeleteDialog bind:open={isDeleteDialogOpen} on:submit={handleDelete} />
  <EditDialog bind:open={isEditDialogOpen} on:submit={handleEdit} {bookmark} />
</Card.Root>
