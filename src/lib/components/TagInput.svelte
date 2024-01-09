<script lang="ts">
  import * as Command from "$lib/components/ui/command"
  import * as Popover from "$lib/components/ui/popover"
  import { Button } from "$lib/components/ui/button"
  import { Badge } from "$lib/components/ui/badge"
  import { tick } from "svelte"
  import { cn } from "$lib/utils"

  type Tag = {
    label: string
    value: string
  }

  let open = $state(false)
  let {
    setFormTags,
    tags = [],
    class: className,
  } = $props<{ setFormTags: (v: string[]) => void; tags: Tag[]; class?: string }>()

  const selectedValue = $state<string[]>([])

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  function handleTagRemove(event: MouseEvent, value: string) {
    event.preventDefault()
    event.stopPropagation()
    selectedValue.splice(selectedValue.indexOf(value), 1)
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class={cn("w-full justify-between", className)}
    >
      {#if selectedValue.length}
        <div class="flex w-full justify-start gap-2 truncate">
          {#each selectedValue as value}
            <Badge class="text-sm">
              {tags.find((tag) => tag.value === value)?.label}
              <Button
                onclickcapture={(e: MouseEvent) => handleTagRemove(e, value)}
                variant="link"
                class="h-auto p-0 text-black"
              >
                <svg
                  class="size-4 ml-1"
                  data-slot="icon"
                  fill="none"
                  stroke-width="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"
                  ></path>
                </svg>
              </Button>
            </Badge>
          {/each}
        </div>
      {:else}
        Select tags..
      {/if}
      <svg
        class="size-4 ml-2 opacity-50"
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
    </Button>
  </Popover.Trigger>
  <Popover.Content sameWidth class="p-0">
    <Command.Root>
      <Command.Input placeholder="Search tags" />
      <Command.Empty>No tag found.</Command.Empty>
      <Command.Group>
        {#each tags as tag}
          <Command.Item
            value={tag.value}
            onSelect={(currentValue) => {
              if (selectedValue.includes(currentValue)) {
                selectedValue.splice(selectedValue.indexOf(currentValue), 1)
              } else {
                selectedValue.push(currentValue)
                setFormTags(selectedValue)
              }
              closeAndFocusTrigger(ids.trigger)
            }}
          >
            <svg
              class={cn("size-4 mr-2", !selectedValue.includes(tag.value) && "text-transparent")}
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path>
            </svg>
            {tag.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
