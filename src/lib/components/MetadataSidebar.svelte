<script lang="ts">
  import { Label } from "$lib/components/ui/label"
  import { Button } from "$lib/components/ui/button"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { cn } from "$lib/utils"
  import { useInterface } from "$state/ui.svelte"
  import { format } from "date-fns"

  const ui = useInterface()

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
    "space-between relative flex h-screen flex-grow flex-col border-l bg-white shadow transition-width dark:border-l-zinc-800 dark:bg-zinc-900",
    ui.metadataSidebarOpen ? "display-block w-[clamp(10vw,_25rem,_35vw)]" : "display-none w-0",
  )}
>
  {#if ui.metadataSidebarOpen}
    <div class="flex h-full flex-col gap-4 p-6">
      <div class="flex items-center justify-between">
        <h2>Metadata</h2>
        <Tooltip.Root>
          <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
            <Button
              builders={[tooltipBuilder]}
              variant="outline"
              size="icon"
              on:click={() => ui.toggleMetadataSidebarEditMode()}
            >
              <svg
                class="size-5"
                data-slot="icon"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                ></path>
              </svg>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="left">
            <p>Toggle Edit Mode</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
      <div class="flex flex-col items-start gap-2">
        <Label for="title">Title</Label>
        <input
          type="text"
          id="title"
          name="title"
          readonly={!ui.metadataSidebarEditMode}
          bind:value={ui.metadataSidebarData.title}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="url">URL</Label>
        <div class="relative">
          <input
            type="url"
            id="url"
            name="url"
            readonly={!ui.metadataSidebarEditMode}
            bind:value={ui.metadataSidebarData.url}
            class={cn(
              "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
          {#if ui.metadataSidebarData.metadata?.logo?.url}
            <img
              class="size-4 absolute left-3 top-3"
              src={ui.metadataSidebarData.metadata?.logo?.url}
              alt="URL Favicon"
            />
          {/if}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="description">Description</Label>
        <input
          type="text"
          id="description"
          name="description"
          readonly={!ui.metadataSidebarEditMode}
          bind:value={ui.metadataSidebarData.description}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="category">Category</Label>
        <input
          type="text"
          id="category"
          name="category"
          readonly={!ui.metadataSidebarEditMode}
          bind:value={ui.metadataSidebarData.category}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
      {#if ui.metadataSidebarData.metadata?.image?.url}
        <div
          class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
        />
        <div class="mb-2 flex min-h-0 flex-col items-start gap-2">
          <Label for="metadata">Cover Photo</Label>
          <img
            src={ui.metadataSidebarData.metadata?.image?.url}
            alt="Bookmark Screenshot"
            class="w-full rounded-md object-cover"
          />
        </div>
      {/if}
      <div class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")} />
      <div class="mb-2 flex min-h-0 flex-grow flex-col items-start gap-2">
        <Label class="mb-2" for="metadata">Metadata</Label>
        <div class="flex w-full justify-between text-sm">
          <span class="font-bold">Language</span>
          <span>
            {ui.metadataSidebarData.metadata?.lang}
          </span>
        </div>
        <div class="flex w-full justify-between text-sm">
          <span class="font-bold">Publisher</span>
          <span>
            {ui.metadataSidebarData.metadata?.publisher}
          </span>
        </div>
        <div class="flex w-full justify-between text-sm">
          <span class="font-bold">Added</span>
          {#if ui.metadataSidebarData.metadata?.date}
            <span>
              {format(ui.metadataSidebarData.metadata?.date, "dd MMM yyyy")}
            </span>
          {/if}
        </div>
      </div>
      {#if ui.metadataSidebarEditMode}
        <div class="w-full">
          <Button class="w-full" variant="default">Save</Button>
        </div>
      {/if}
    </div>
  {/if}
</aside>
