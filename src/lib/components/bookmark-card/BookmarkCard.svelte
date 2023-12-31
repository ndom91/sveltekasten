<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import { AspectRatio } from "$lib/components/ui/aspect-ratio"
  import { Button } from "$lib/components/ui/button"
  import { Trash, Pencil, ExternalLink } from "lucide-svelte"
  import DeleteDialog from "./DeleteDialog.svelte"
  import EditDialog from "./EditDialog.svelte"
  import type { Bookmark } from "$lib/types"

  export let bookmark: Bookmark

  let isDeleteDialogOpen = false
  let isEditDialogOpen = false

  const handleDialogOpen = () => {
    isDeleteDialogOpen = true
  }

  const handleEditOpen = () => {
    isEditDialogOpen = true
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
    <p class="text-sm text-muted">{bookmark.url}</p>
  </Card.Footer>
  <DeleteDialog bind:open={isDeleteDialogOpen} bookmarkId={bookmark.id} />
  <EditDialog bind:open={isEditDialogOpen} {bookmark} />
</Card.Root>
