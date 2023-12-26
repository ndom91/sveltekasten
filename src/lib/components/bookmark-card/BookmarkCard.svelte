<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import { Button } from "$lib/components/ui/button"
  import type { Bookmark } from "$lib/types"
  import { Trash } from "lucide-svelte"
  import DeleteDialog from "./DeleteDialog.svelte"

  export let bookmark: Bookmark

  let isDeleteDialogOpen = false

  // @ts-expect-error
  const handleDialogOpen = (targetState) => {
    isDeleteDialogOpen = targetState
  }

  const handleDelete = () => {
    console.log("Deleting..")
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
        <Button variant="ghost" size="icon" on:click={() => handleDialogOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </Card.Title>
      <Card.Description class="line-clamp-2 break-words">{bookmark.desc}</Card.Description>
    </div>
  </Card.Header>
  <Card.Content class="flex-grow">
    <div class="relative flex">
      <img
        src={bookmark.image}
        alt="Bookmark Screenshot"
        class="max-w-56 aspect-video rounded-md object-cover"
      />
    </div>
  </Card.Content>
  <Card.Footer>
    <p>{bookmark.url}</p>
  </Card.Footer>
  <DeleteDialog open={isDeleteDialogOpen} on:close={handleDialogOpen} on:submit={handleDelete} />
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
