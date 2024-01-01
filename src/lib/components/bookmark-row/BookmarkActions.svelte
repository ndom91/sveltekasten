<script lang="ts">
  import { cn } from "$lib/utils"
  import { Button } from "$lib/components/ui/button"
  import { Trash, Pencil, ExternalLink } from "lucide-svelte"

  export let isOptionsOpen: boolean
  export let url: string
  export let handleEditDialogOpen: () => void
  export let handleDeleteDialogOpen: () => void
</script>

<div
  class={cn(
    "absolute right-4 top-4 flex rounded-xl bg-zinc-200 bg-opacity-75 p-2 text-white transition-opacity delay-500 ease-in-out dark:bg-zinc-950",
    isOptionsOpen ? "opacity-100" : "opacity-0",
  )}
>
  <Button variant="ghost" size="icon" href={url} target="_blank">
    <ExternalLink class="size-5" strokeWidth={1.5} />
  </Button>
  <Button variant="ghost" size="icon" on:click={handleEditDialogOpen}>
    <Pencil class="size-5" strokeWidth={1.5} />
  </Button>
  <Button variant="ghost" size="icon" on:click={handleDeleteDialogOpen}>
    <Trash class="size-5" strokeWidth={1.5} color="#fca5a5" />
  </Button>
</div>
