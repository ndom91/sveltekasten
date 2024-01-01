<script lang="ts">
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import { ChevronRight } from "lucide-svelte"
  import { cn } from "$lib/utils"

  let expanded = false
  let title = ""
  let url = ""
  let description = ""
  let category = ""
  let metadata = {}

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    console.log(event.code)
    if (event.code === "BracketRight") {
      expanded = !expanded
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<aside
  class={cn(
    "space-between relative flex h-full h-screen flex-grow flex-col bg-white shadow transition-width dark:bg-zinc-900",
    expanded ? "display-block w-[75rem]" : "display-none w-0",
  )}
>
  {#if expanded}
    <div class="flex h-full flex-col gap-4 p-6">
      <h2>Metadata</h2>
      <div class="flex flex-col items-start gap-2">
        <Label for="title">Title</Label>
        <input
          type="text"
          name="title"
          bind:value={title}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="title">URL</Label>
        <input
          type="text"
          name="title"
          bind:value={url}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="title">Description</Label>
        <input
          type="text"
          name="description"
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="title">Category</Label>
        <input
          type="text"
          name="category"
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      <hr class="px-8 text-zinc-50" />
      <div class="flex flex-col items-start">
        <Label for="title">Metadata</Label>
      </div>
    </div>
    <div class="p-6">
      <Button size="icon" variant="ghost" on:click={() => (expanded = !expanded)}>
        <ChevronRight class="size-8 text-zinc-50" />
        <span class="sr-only">Toggle metadata menu</span>
      </Button>
    </div>
  {/if}
</aside>
