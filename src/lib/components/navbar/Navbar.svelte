<script lang="ts">
  import { blur } from "svelte/transition"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { QuickAddForm } from "$lib/components/navbar"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"

  const ui = useInterface()
  let searchInputEl: HTMLInputElement

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) return
    if (event.altKey && event.code === "KeyN") {
      event.preventDefault()
      ui.toggleQuickAdd(true)
    }
    if (event.code === "Slash") {
      event.preventDefault()
      searchInputEl.focus()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<nav
  class="mx-auto flex w-full items-center justify-end gap-4 border-b border-b-zinc-100 p-4 dark:border-b-zinc-900"
>
  <div
    class="relative rounded-md transition duration-300 focus-within:rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-800"
  >
    <input
      type="text"
      id="search"
      name="search"
      bind:this={searchInputEl}
      bind:value={ui.searchQuery}
      spellcheck="false"
      aria-label="Search"
      class={"flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
    />
    <svg
      class="size-4 absolute left-3 top-3"
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
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      ></path>
    </svg>
    <KeyboardIndicator key="/" class="absolute right-3 top-2 text-xs" />
  </div>
  <div
    class="rounded-full transition duration-300 focus-within:rounded-full focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-800"
  >
    <Popover.Root open={ui.quickAddOpen}>
      <Tooltip.Root>
        <Popover.Trigger asChild let:builder={popoverBuilder}>
          <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
            <Button
              builders={[popoverBuilder, tooltipBuilder]}
              variant="outline"
              class="size-11 rounded-full p-0"
            >
              <svg
                class="size-5"
                data-slot="icon"
                aria-label="Quick Add"
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
                  d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                ></path>
              </svg>
            </Button>
          </Tooltip.Trigger>
        </Popover.Trigger>
        <Tooltip.Content>
          <p class="flex items-center justify-center">
            Quick add Bookmark <KeyboardIndicator key="Alt N" class="ml-2 text-xs" />
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
      <Popover.Content
        transition={blur}
        transitionConfig={{ delay: 0, duration: 250 }}
        sideOffset={15}
        alignOffset={15}
      >
        <QuickAddForm />
      </Popover.Content>
    </Popover.Root>
  </div>
  <div
    class="rounded-full transition duration-300 focus-within:rounded-full focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-800"
  >
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
        <Button
          builders={[tooltipBuilder]}
          variant="outline"
          class="size-11 rounded-full p-0"
          on:click={() => ui.toggleMetadataSidebar()}
        >
          {#if ui.metadataSidebarOpen}
            <svg
              class="size-5"
              data-slot="icon"
              fill="none"
              aria-label="Metadata Sidebar"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              ></path>
            </svg>
          {:else}
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              ></path>
            </svg>
          {/if}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p class="flex items-center justify-center">
          Toggle Sidebar <KeyboardIndicator key="]" class="ml-2 text-xs" />
        </p>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</nav>
