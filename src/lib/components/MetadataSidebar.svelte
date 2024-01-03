<script lang="ts">
  import { Label } from "$lib/components/ui/label"
  import { Button } from "$lib/components/ui/button"
  import * as Select from "$lib/components/ui/select"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { cn } from "$lib/utils"
  import { enhance } from "$app/forms"
  import { form_action } from "$lib/form_action"
  import { useInterface } from "$state/ui.svelte"
  import { format } from "date-fns"
  import toast from "svelte-french-toast"

  const ui = useInterface()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) return
    if (event.code === "BracketRight") {
      event.preventDefault()
      ui.toggleMetadataSidebar()
    }
  }

  const isEditMode = $derived(ui.metadataSidebarEditMode !== true)

  const copyColor = (e: MouseEvent, color: string) => {
    e.preventDefault()
    toast.success(`Copied ${color} clipboard!`)
    navigator.clipboard.writeText(color)
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<aside
  class={cn(
    "space-between relative flex h-screen flex-grow flex-col border-l bg-zinc-50 transition-width dark:border-l-zinc-800 dark:bg-zinc-900",
    ui.metadataSidebarOpen ? "display-block w-[clamp(10vw,_25rem,_35vw)]" : "display-none w-0",
  )}
>
  {#if ui.metadataSidebarOpen}
    <form
      method="post"
      action="/dashboard?/saveMetadataEdits"
      use:enhance={form_action()}
      class="flex h-full items-center justify-start gap-4"
    >
      <input type="hidden" name="id" value={ui.metadataSidebarData.bookmark.id} />
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
            readonly={!isEditMode}
            bind:value={ui.metadataSidebarData.bookmark.title}
            class={cn(
              "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !isEditMode ? "cursor-default text-muted" : "bg-zinc-100 dark:bg-zinc-950",
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
              readonly={!isEditMode}
              bind:value={ui.metadataSidebarData.bookmark.url}
              class={cn(
                "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                ui.metadataSidebarData.bookmark.metadata?.logo?.url && "pl-10",
                !isEditMode ? "cursor-default text-muted" : "bg-zinc-100 dark:bg-zinc-950",
              )}
            />
            {#if ui.metadataSidebarData.bookmark.metadata?.logo?.url}
              <img
                class="size-4 absolute left-3 top-3"
                src={ui.metadataSidebarData.bookmark.metadata?.logo?.url}
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
            readonly={!isEditMode}
            bind:value={ui.metadataSidebarData.bookmark.desc}
            class={cn(
              "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !isEditMode ? "cursor-default text-muted" : "bg-zinc-100 dark:bg-zinc-950",
            )}
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="category">Category</Label>
          <Select.Root
            disabled={!isEditMode}
            name="categoryId"
            items={ui.metadataSidebarData?.categories?.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            onSelectedChange={(e) => (ui.metadataSidebarData.bookmark.categoryId = e.value)}
          >
            <Select.Trigger class="w-full enabled:bg-zinc-950 disabled:cursor-default">
              <Select.Value placeholder="Category" />
            </Select.Trigger>
            <Select.Input />
            <Select.Content>
              {#each ui.metadataSidebarData.categories as category (category.id)}
                <Select.Item value={category.id}>{category.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        {#if ui.metadataSidebarData.bookmark.metadata?.image?.url}
          <div
            class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
          />
          <div class="mb-2 flex min-h-0 flex-col items-start gap-2">
            <h2>Cover Photo</h2>
            <img
              src={ui.metadataSidebarData.bookmark.metadata?.image?.url}
              alt="Bookmark Screenshot"
              class="w-full rounded-md object-cover"
            />
          </div>
        {/if}
        <div
          class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
        />
        <div class="mb-2 flex min-h-0 flex-grow flex-col items-start gap-2">
          <h2>Metadata</h2>
          <div class="flex w-full justify-between text-sm">
            <span class="font-bold">Language</span>
            <span>
              {ui.metadataSidebarData.bookmark.metadata?.lang}
            </span>
          </div>
          <div class="flex w-full justify-between text-sm">
            <span class="font-bold">Publisher</span>
            <span>
              {ui.metadataSidebarData.bookmark.metadata?.publisher}
            </span>
          </div>
          <div class="flex w-full justify-between text-sm">
            <span class="font-bold">Added</span>
            {#if ui.metadataSidebarData.bookmark.metadata?.date}
              <span>
                {format(ui.metadataSidebarData.bookmark.metadata?.date, "dd MMM yyyy")}
              </span>
            {/if}
          </div>
          <div class="flex w-full justify-between text-sm">
            <span class="font-bold">Colors</span>
            {#if ui.metadataSidebarData.bookmark.metadata?.logo?.palette}
              <div class="flex gap-1">
                {#each ui.metadataSidebarData.bookmark.metadata?.logo?.palette as color}
                  <button
                    onclick={(e) => copyColor(e, color)}
                    class="size-4 rounded-full"
                    style={`background-color: ${color}`}
                  />
                {/each}
              </div>
            {/if}
          </div>
        </div>
        {#if isEditMode}
          <div class="w-full">
            <Button type="submit" class="w-full" variant="default">Save</Button>
          </div>
        {/if}
      </div>
    </form>
  {/if}
</aside>
