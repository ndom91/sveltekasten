<script lang="ts">
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command"
  import * as Popover from "$lib/components/ui/popover"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { Button } from "$lib/components/ui/button"
  import { page } from "$app/stores"

  let open = $state(false)

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }
</script>

<section class="p-4 border-l-4 md:px-8 border-l-transparent">
  <Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        class="justify-between w-[200px]"
      >
        Categories
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
      </Button>
    </Popover.Trigger>
    <Popover.Content class="p-0 w-[200px]">
      <Command.Root>
        <Command.Input placeholder="Search.." />
        <Command.Empty>No results</Command.Empty>
        <Command.Group>
          {#each $page.data.categories as item}
            <Command.Item
              value={item.name}
              onSelect={() => {
                closeAndFocusTrigger(ids.trigger)
              }}
            >
              <Checkbox id={item.id} bind:checked={item.visible} />
              <span class="ml-2 truncate">{item.name}</span>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</section>
