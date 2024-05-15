<script lang="ts">
  import { page } from "$app/stores"
  import { dev } from "$app/environment"
  import { zodClient } from "sveltekit-superforms/adapters"
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { format } from "@formkit/tempo"
  import toast from "svelte-french-toast"
  import { invalidateAll } from "$app/navigation"

  import { buttonVariants } from "$lib/components/ui/button"
  import { cn } from "$lib/utils/style"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { formSchema as metadataSchema } from "$schemas/metadata-sidebar"

  import { Label } from "$lib/components/ui/label"
  import { Button } from "$lib/components/ui/button"
  // import * as Select from "$lib/components/ui/select"
  import * as Command from "$lib/components/ui/command"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import * as Popover from "$lib/components/ui/popover"
  import TagInput from "$lib/components/TagInput.svelte"
  import { getContext } from "svelte"

  const bookmarkStore = getContext("bookmarks")
  console.log("sidebar.bkContext", bookmarkStore)

  const ui = useInterface()

  const isEditMode = $derived(ui.metadataSidebarEditMode === true)
  const bookmark = bookmarkStore.find(ui.metadataSidebarData.bookmark?.id!)
  console.log("sidebar.foundBookmark", bookmark)

  const defaultData = {
    id: ui.metadataSidebarData.bookmark?.id!,
    url: ui.metadataSidebarData.bookmark?.url!,
    title: ui.metadataSidebarData.bookmark?.title!,
    description: ui.metadataSidebarData.bookmark?.desc!,
    image: ui.metadataSidebarData.bookmark?.image!,
    category: ui.metadataSidebarData.bookmark?.category?.id,
    tags: ui.metadataSidebarData.bookmark?.tags!,
  }

  const superformInstance = superForm(defaults(defaultData, zodClient(metadataSchema)), {
    resetForm: false,
    dataType: "json",
    validators: zodClient(metadataSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success("Bookmark Updated")
        ui.toggleMetadataSidebarEditMode()
        invalidateAll()
      }
    },
    onError: ({ result }) => {
      if (result.type === "error") {
        toast.error(result.error.message)
      }
    },
  })
  const { form, errors, constraints, enhance, submitting, delayed } = superformInstance

  let selectOpen = $state(false)
</script>

<form
  method="POST"
  action="/bookmarks?/saveMetadata"
  use:enhance
  class="flex gap-4 justify-start items-center h-full"
>
  <div class="flex overflow-y-scroll flex-col gap-4 p-6 pr-4 w-full h-full">
    <div class="flex justify-between items-center">
      <h2>Metadata</h2>
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
          <Button
            builders={[tooltipBuilder]}
            variant="outline"
            disabled={!ui.metadataSidebarData.bookmark}
            size="icon"
            onclick={() => ui.toggleMetadataSidebarEditMode()}
          >
            <svg
              class="pointer-events-none size-5"
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
        <span class="leading-loose">
          Please select a bookmark to view in detail and edit by clicking the
          <span
            title="Edit"
            class="inline-block p-1 mx-1 align-text-bottom rounded-sm size-6 bg-neutral-200 dark:bg-neutral-800"
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
          button in the actions overlay when hovering over a bookmark.
        </span>
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
        ></textarea>
        {#if $errors.description}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
      </div>
      <div class="flex flex-col gap-2">
        <Popover.Root class="relative" bind:open={selectOpen} let:ids>
          <Label>Category</Label>
          <Popover.Trigger
            class={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-between bg-transparent",
              !$form.category && "text-muted-foreground",
              !isEditMode
                ? "cursor-default pointer-events-none text-muted"
                : "bg-zinc-100 dark:bg-zinc-950",
            )}
            role="combobox"
          >
            {ui.metadataSidebarData.categories.find((c) => c.id === $form.category)?.name ??
              "Select category"}
            <svg
              class="ml-2 w-4 h-4 opacity-50 shrink-0"
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
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              ></path>
            </svg>
          </Popover.Trigger>
          <Popover.Content class="p-0 w-[230px]">
            <Command.Root>
              <Command.Input autofocus placeholder="Search categories..." class="h-9" />
              <Command.Empty>No categories.</Command.Empty>
              <Command.Group>
                {#each ui.metadataSidebarData.categories as category}
                  <Command.Item
                    value={category.name}
                    class="justify-between w-full cursor-pointer"
                    onSelect={() => {
                      // Toggle selected on/off
                      $form.category = $form.category === category.id ? undefined : category.id
                    }}
                  >
                    <svg
                      class={cn("size-4", category.id !== $form.category && "text-transparent")}
                      data-slot="icon"
                      fill="none"
                      stroke-width="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"
                      ></path>
                    </svg>
                    <span>{category.name}</span>
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="category">Tags</Label>
        <TagInput
          form={superformInstance}
          tags={$page.data.tags}
          field="tags"
          disabled={!isEditMode}
        />
      </div>
      {#if ui.metadataSidebarData.bookmark.image}
        <div
          class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
        ></div>
        <div class="flex flex-col gap-2 items-start mb-2">
          <h2>Cover Photo</h2>
          <img
            src={ui.metadataSidebarData.bookmark.image}
            alt="Bookmark Screenshot"
            class="object-cover w-full max-w-sm rounded-md border-2 border-neutral-100 dark:border-neutral-800"
          />
        </div>
      {/if}
      <div
        class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
      ></div>
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
