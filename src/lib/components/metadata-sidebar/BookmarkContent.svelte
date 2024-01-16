<script lang="ts">
  import { cn } from "$lib/utils/style"
  import { page } from "$app/stores"
  import { enhance } from "$app/forms"
  import { form_action } from "$lib/form_action"
  import { useInterface } from "$state/ui.svelte"

  import { Label } from "$lib/components/ui/label"
  import { Button } from "$lib/components/ui/button"
  import * as Select from "$lib/components/ui/select"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import TagInput from "$lib/components/TagInput.svelte"

  import { format } from "date-fns"
  import toast from "svelte-french-toast"
  import type { Tag, TagsOnBookmarks } from "$zod"

  const ui = useInterface()

  const isEditMode = $derived(ui.metadataSidebarEditMode === true)

  const copyColor = (e: MouseEvent, color: string) => {
    e.preventDefault()
    toast.success(`Copied ${color} clipboard!`)
    navigator.clipboard.writeText(color)
  }
</script>

<form
  method="post"
  action="/dashboard?/saveMetadataEdits"
  use:enhance={form_action()}
  class="flex gap-4 justify-start items-center h-full"
>
  <input type="hidden" name="id" value={ui.metadataSidebarData.bookmark.id} />
  <div class="flex flex-col gap-4 p-6 h-full">
    <div class="flex justify-between items-center">
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
    <div class="flex flex-col gap-2 items-start">
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
            ui.metadataSidebarData.bookmark.metadata?.logo && "pl-10",
            !isEditMode ? "cursor-default text-muted" : "bg-zinc-100 dark:bg-zinc-950",
          )}
        />
        {#if ui.metadataSidebarData.bookmark.metadata?.logo}
          <img
            class="absolute top-3 left-3 size-4"
            src={ui.metadataSidebarData.bookmark.metadata?.logo}
            alt="URL Favicon"
          />
        {/if}
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <Label for="description">Description</Label>
      <textarea
        rows="4"
        id="description"
        name="description"
        readonly={!isEditMode}
        bind:value={ui.metadataSidebarData.bookmark.desc}
        class={cn(
          "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
        selected={{
          value: ui.metadataSidebarData.bookmark.categoryId,
          label: ui.metadataSidebarData?.categories?.find(
            (cat) => cat.id === ui.metadataSidebarData.bookmark.categoryId,
          )?.name,
        }}
        onSelectedChange={(e) => (ui.metadataSidebarData.bookmark.categoryId = e?.value ?? null)}
      >
        <Select.Trigger class="w-full disabled:cursor-default enabled:bg-zinc-950">
          <Select.Value placeholder="Category" />
        </Select.Trigger>
        <Select.Input />
        <Select.Content>
          {#if ui.metadataSidebarData.categories}
            {#each ui.metadataSidebarData.categories as category (category.id)}
              <Select.Item value={category.id}>{category.name}</Select.Item>
            {/each}
          {/if}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex flex-col gap-2">
      <Label for="category">Tags</Label>
      <TagInput
        tags={$page.data?.tags.map((tag: Tag) => ({ value: tag.id, label: tag.name }))}
        disabled={!isEditMode}
        setFormTags={(v) => (ui.metadataSidebarData.bookmark.tags = v)}
        selected={ui.metadataSidebarData.bookmark?.tags?.map((tag: TagsOnBookmarks) => tag.tagId) ?? []}
        class="bg-transparent"
      />
      <input type="hidden" name="tagIds" id="tagIds" value={ui.metadataSidebarData.tags} />
    </div>
    {#if ui.metadataSidebarData.bookmark.image}
      <div class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")} />
      <div class="flex flex-col gap-2 items-start mb-2 min-h-0">
        <h2>Cover Photo</h2>
        <img
          src={ui.metadataSidebarData.bookmark.image}
          alt="Bookmark Screenshot"
          class="object-cover w-full rounded-md"
        />
      </div>
    {/if}
    <div class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")} />
    <div class="flex flex-col flex-grow gap-2 items-start mb-2 min-h-0">
      <h2>Metadata</h2>
      <div class="flex justify-between w-full text-sm">
        <span class="font-bold">Language</span>
        <span>
          {ui.metadataSidebarData.bookmark.metadata?.lang}
        </span>
      </div>
      <div class="flex justify-between w-full text-sm">
        <span class="font-bold">Publisher</span>
        <span>
          {ui.metadataSidebarData.bookmark.metadata?.publisher}
        </span>
      </div>
      <div class="flex justify-between w-full text-sm">
        <span class="font-bold">Added</span>
        {#if ui.metadataSidebarData.bookmark.createdAt}
          <span>
            {format(ui.metadataSidebarData.bookmark.createdAt, "dd MMM yyyy")}
          </span>
        {/if}
      </div>
      <div class="flex justify-between w-full text-sm">
        <span class="font-bold">Colors</span>
        {#if ui.metadataSidebarData.bookmark.metadata?.palette}
          <div class="flex gap-1">
            {#each ui.metadataSidebarData.bookmark.metadata?.palette as color}
              <button
                onclick={(e) => copyColor(e, color)}
                class="rounded-full size-4"
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
