<script lang="ts">
  import { page } from "$app/stores"
  import { dev } from "$app/environment"
  import { zod } from "sveltekit-superforms/adapters"
  import SuperDebug, { defaults, superForm, fieldProxy } from "sveltekit-superforms"
  import { format } from "@formkit/tempo"
  import toast from "svelte-french-toast"
  import type { Tag } from "$zod"

  import { cn } from "$lib/utils/style"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { formSchema as metadataSchema } from "$schemas/metadata-sidebar"

  import { Label } from "$lib/components/ui/label"
  import { Button } from "$lib/components/ui/button"
  import * as Select from "$lib/components/ui/select"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import TagInput from "$lib/components/TagInput.svelte"

  const ui = useInterface()

  const isEditMode = $derived(ui.metadataSidebarEditMode === true)

  const defaultData = {
    id: ui.metadataSidebarData.bookmark?.id,
    url: ui.metadataSidebarData.bookmark?.url,
    title: ui.metadataSidebarData.bookmark?.title,
    description: ui.metadataSidebarData.bookmark?.desc,
    image: ui.metadataSidebarData.bookmark?.image,
    category: ui.metadataSidebarData.bookmark?.category,
    tags: ui.metadataSidebarData.bookmark?.tags,
  }
  const superformInstance = superForm(defaults(defaultData, zod(metadataSchema)), {
    resetForm: false,
    dataType: "json",
    validators: zod(metadataSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success("Bookmark Updated")
        ui.toggleMetadataSidebarEditMode()
      }
    },
    onError: ({ result }) => {
      if (result.type === "error") {
        toast.error(result.error.message)
      }
    },
  })
  $inspect("superformInstance", superformInstance)
  const { form, message, errors, constraints, enhance, submitting, delayed } = superformInstance

  $inspect("form", $form)

  const tagValues = $derived(
    $page.data.tags.map((tag: Tag) => ({ value: tag.id, label: tag.name })),
  )
</script>

<form
  method="POST"
  action="?/saveMetadata"
  use:enhance
  class="flex gap-4 justify-start items-center w-full h-full"
>
  <div class="flex overflow-y-scroll flex-col gap-4 p-6 w-full h-full">
    <div class="flex justify-between items-center">
      <h2>Metadata</h2>
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
          <Button
            builders={[tooltipBuilder]}
            variant="outline"
            disabled={!ui.metadataSidebarData.bookmark}
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
    {#if !ui.metadataSidebarData.bookmark}
      <div class="inline mt-2 leading-relaxed">
        <div class="font-bold">No bookmark selected.</div>
        <span class="">Please select a bookmark to view in detail or edit by clicking the</span>
        <span
          title="Edit button"
          class="inline-block p-1 mx-1 rounded-sm baseline size-6 dark:bg-neutral-800"
        >
          <svg
            class="size-4 text-zinc-900 dark:text-zinc-200"
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            ></path>
          </svg>
        </span>
        <span>button in the actions overlay when hovering over a bookmark.</span>
      </div>
    {:else}
      <div class="flex flex-col gap-2 items-start">
        <Label for="title">Title</Label>
        <input
          type="text"
          id="title"
          readonly={!isEditMode}
          bind:value={$form.title}
          aria-invalid={$errors.title ? "true" : undefined}
          {...$constraints.title}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !isEditMode ? "cursor-default text-muted" : "bg-zinc-100 dark:bg-zinc-950",
          )}
        />
        {#if $errors.title}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
      </div>
      <div class="flex flex-col gap-2">
        <Label for="url">URL</Label>
        <div class="relative">
          <input
            type="url"
            id="url"
            readonly={!isEditMode}
            bind:value={$form.url}
            aria-invalid={$errors.url ? "true" : undefined}
            {...$constraints.url}
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
        {#if $errors.url}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
      </div>
      <div class="flex flex-col gap-2 grow-wrap">
        <Label for="description">Description</Label>
        <textarea
          rows="4"
          id="description"
          readonly={!isEditMode}
          bind:value={$form.description}
          aria-invalid={$errors.description ? "true" : undefined}
          {...$constraints.description}
          class={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !isEditMode ? "cursor-default text-muted" : "bg-zinc-100 dark:bg-zinc-950",
          )}
        />
        {#if $errors.description}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
      </div>
      <div class="flex flex-col gap-2">
        <Label for="category">Category</Label>
        <Select.Root
          disabled={!isEditMode}
          items={ui.metadataSidebarData?.categories?.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          selected={{
            value: $form.category?.id,
            label: $form.category?.name,
          }}
          onSelectedChange={(e) =>
            ($form.category = ui.metadataSidebarData.categories.find((cat) => cat.id === e.value))}
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
          form={superformInstance}
          tags={$page.data.tags}
          field="tags"
          disabled={!isEditMode}
        />
        <!-- <TagInput -->
        <!--   tags={$page.data?.tags.map((tag: Tag) => ({ value: tag.id, label: tag.name }))} -->
        <!--   disabled={!isEditMode} -->
        <!--   setFormTags={(v) => (ui.metadataSidebarData.bookmark.tags = v)} -->
        <!--   selected={ui.metadataSidebarData.bookmark?.tags?.map((tag: TagsOnBookmarks) => tag.tagId) ?? []} -->
        <!--   class="bg-transparent" -->
        <!-- /> -->
      </div>
      {#if ui.metadataSidebarData.bookmark.image}
        <div
          class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
        />
        <div class="flex flex-col gap-2 items-start mb-2">
          <h2>Cover Photo</h2>
          <img
            src={ui.metadataSidebarData.bookmark.image}
            alt="Bookmark Screenshot"
            class="object-cover w-full rounded-md"
          />
        </div>
      {/if}
      <div class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")} />
      <div class="flex flex-col flex-grow gap-2 items-start mb-2">
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
              {format(ui.metadataSidebarData.bookmark.createdAt, "medium")}
            </span>
          {/if}
        </div>
      </div>
      {#if isEditMode}
        <div class="w-full">
          <Button
            type="submit"
            disabled={$submitting || $delayed}
            class="w-full transition-shadow duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ring-offset-background focus:ring-foreground focus:ring-offset-background"
          >
            {#if $submitting || $delayed}
              <LoadingIndicator class="mr-2" />
            {/if}
            Save
          </Button>
        </div>
      {/if}
      {#if dev}
        <div class="flex flex-col pt-4">
          <SuperDebug data={{ $form, $constraints, $errors }} collapsible={true} theme="vscode" />
        </div>
      {/if}
    {/if}
  </div>
</form>
