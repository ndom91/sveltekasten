<script lang="ts">
  import DateRangePicker from "$lib/components/date-range/DateRangePicker.svelte"
  import { Button } from "$lib/components/ui/button"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import * as Command from "$lib/components/ui/command"
  import { Label } from "$lib/components/ui/label"
  import * as Popover from "$lib/components/ui/popover"
  import { useInterface } from "$state/ui.svelte"
  import { page } from "$app/stores"

  const ui = useInterface()
  let open = $state(false)

  const feeds = $state($page.data.feeds.data)
  // $inspect({ feeds })
</script>

<section
  class="p-4 border-l-4 md:px-8 border-l-transparent flex justify-start items-center gap-4 flex-wrap"
>
  <div
    class="flex justify-center items-center gap-2 border border-input rounded-md h-10 px-2 bg-neutral-100 dark:bg-neutral-900"
  >
    <div class="mx-2 flex justify-center items-center gap-2">
      <Checkbox id="unread" bind:checked={ui.showUnreadOnly} />
      <Label class="hover:cursor-pointer" for="unread">Unread Only</Label>
    </div>
  </div>
  <Popover.Root bind:open>
    <Popover.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        class="justify-between min-w-[150px] md:w-[200px] bg-neutral-100 dark:bg-neutral-900 "
      >
        Feeds
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
    <Popover.Content class="p-0 w-[calc(100vw-2.2rem)] md:w-[200px]">
      <Command.Root>
        <Command.Input placeholder="Search.." />
        <Command.Empty>No results</Command.Empty>
        <Command.Group>
          {#each feeds as feed}
            <Command.Item class="flex" value={feed.name}>
              <Checkbox id={feed.id} bind:checked={feed.visible} />
              <label
                class="flex hover:cursor-pointer flex-grow truncate items-center max-w-full w-fit"
                for={feed.id}
              >
                <span class="truncate flex-grow mx-2">{feed.name}</span>
                <img
                  src={`https://favicon.yandex.net/favicon/${new URL(feed.url).hostname}`}
                  alt="URL Favicon"
                  class="m-2 rounded-full size-5"
                />
              </label>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
  <DateRangePicker />
</section>
