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
          <Button variant="ghost" size="icon" on:click={() => handleEditOpen(true)}>
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" on:click={() => handleDialogOpen(true)}>
            <Trash className="h-4 w-4" strokeWidth={1.5} color="#fca5a5" />
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
  <DeleteDialog open={isDeleteDialogOpen} on:close={handleDialogOpen} on:submit={handleDelete} />
  <EditDialog open={isEditDialogOpen} on:close={handleEditOpen} on:submit={handleEdit} {bookmark} />
</Card.Root>

<style>
  .adaptive-glass {
    --glass-lightness: 100%;
    background: hsl(0 0% var(--glass-lightness) / 50%);
    backdrop-filter: blur(40px);
    @media (prefers-color-scheme: dark) {
      --glass-lightness: 0%;
    }
  }
</style>
