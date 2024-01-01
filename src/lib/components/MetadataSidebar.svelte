<script lang="ts">
  import { Label } from "$lib/components/ui/label"
  import { cn } from "$lib/utils"
  import { createUI } from "$state/ui.svelte"

  const ui = createUI()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    if (event.code === "BracketRight") {
      event.preventDefault()
      ui.toggleMetadataSidebar()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<aside
  class={cn(
    "space-between relative flex h-full h-screen flex-grow flex-col bg-white shadow transition-width dark:bg-zinc-900",
    ui.metadataSidebarOpen ? "display-block w-[clamp(10vw,_25rem,_35vw)]" : "display-none w-0",
  )}
>
  {#if ui.metadataSidebarOpen}
    <div class="flex h-full flex-col gap-4 p-6">
      <h2>Metadata</h2>
      <div class="flex flex-col items-start gap-2">
        <Label for="title">Title</Label>
        <input
          type="text"
          name="title"
          bind:value={ui.metadataSidebarData.title}
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
          bind:value={ui.metadataSidebarData.url}
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
          bind:value={ui.metadataSidebarData.description}
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
          bind:value={ui.metadataSidebarData.category}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      <hr class="px-8 text-zinc-50" />
      <div class="flex min-h-0 flex-grow flex-col items-start">
        <Label for="title">Metadata</Label>
        <pre class="min-h-full max-w-full flex-grow overflow-auto">{JSON.stringify(
            ui.metadataSidebarData.metadata,
            null,
            2,
          )}</pre>
      </div>
    </div>
  {/if}
</aside>
