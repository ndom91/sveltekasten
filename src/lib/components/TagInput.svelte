<script lang="ts" context="module">
  export type Tag = {
    label: string
    value: string
  }
</script>

<script lang="ts">
  import * as Command from "$lib/components/ui/command"
  import * as Popover from "$lib/components/ui/popover"
  import { Button } from "$lib/components/ui/button"
  import { Badge } from "$lib/components/ui/badge"
  import { tick } from "svelte"
  import { cn } from "$lib/utils/style"
  import { Combobox } from "bits-ui"
  import { flyAndScale } from "$lib/utils/style"

  let open = $state(false)
  let {
    setFormTags,
    tags = [],
    class: className,
    disabled = false,
    selected = [],
  } = $props<{
    setFormTags: (v: string[]) => void
    tags: Tag[]
    disabled?: boolean
    class?: string
    selected?: string[]
  }>()

  let inputValue = $state<string[]>("")
  let selectedValues = $state([])
  let filteredTags = $derived(
    inputValue
      ? tags.filter((tag) => tag.label.toLowerCase().includes(inputValue.toLowerCase()))
      : tags,
  )

  function handleTagRemove(event: MouseEvent, value: string) {
    event.preventDefault()
    event.stopPropagation()
    selectedValues.splice(selectedValues.indexOf(value), 1)
  }

  console.log({ tags })
  $inspect("sV", selectedValues)
  $inspect("iV", inputValue)
</script>

<Combobox.Root
  multiple
  {disabled}
  items={filteredTags}
  name="tags"
  bind:selected={selectedValues}
  bind:inputValue
>
  <div class="relative">
    <svg
      class="absolute top-1/2 -translate-y-1/2 start-[0.6rem] size-5 text-foreground"
      data-slot="icon"
      fill="none"
      aria-label="tag"
      stroke-width="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
      ></path>
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"></path>
    </svg>

    <Combobox.Input
      class="inline-flex py-2 px-3 pl-10 w-full h-10 text-sm rounded-md border transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none truncate border-input bg-background placeholder:text-foreground/50 focus:ring-foreground focus:ring-offset-background"
      placeholder="Select a tag"
      aria-label="Select a tag"
    />
    <svg
      class="absolute top-1/2 -translate-y-1/2 end-[0.6rem] size-5 text-neutral-50/50"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="80 176 128 224 176 176"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="12"
      />
      <polyline
        points="80 80 128 32 176 80"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="12"
      />
    </svg>
  </div>
  <Combobox.Content
    class="p-2 w-full rounded-md border outline-none border-neutral-50 bg-background shadow-popover dark:border-neutral-700"
    transition={flyAndScale}
    sideOffset={8}
  >
    {#each filteredTags as tag (tag.value)}
      <Combobox.Item
        class="flex items-center py-1 pr-1.5 pl-4 w-full h-8 text-sm rounded-md transition-all duration-75 outline-none select-none data-[highlighted]:bg-popover"
        value={tag.value}
        label={tag.label}
      >
        {tag.label}
        <Combobox.ItemIndicator class="ml-auto" asChild={false}>
          <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none" />
            <polyline
              points="40 144 96 200 224 72"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            />
          </svg>
        </Combobox.ItemIndicator>
      </Combobox.Item>
    {:else}
      <span class="block py-2 px-5 text-sm text-muted-foreground"> No results found </span>
    {/each}
  </Combobox.Content>
  <Combobox.HiddenInput name="selectedTag" />
</Combobox.Root>
{#if selectedValues.length}
  <div class="flex flex-wrap gap-2 mb-2">
    {#each selectedValues as tag (tag.value)}
      <Badge class="text-xs">
        {tag.label}
      </Badge>
    {/each}
  </div>
{/if}
