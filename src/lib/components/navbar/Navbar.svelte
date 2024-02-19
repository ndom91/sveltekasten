<script lang="ts">
  import { blur } from "svelte/transition"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { QuickAddForm } from "$lib/components/navbar"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { Breadcrumbs } from "$lib/components/navbar"
  import { useInterface } from "$state/ui.svelte"
  import { flyAndScale } from "$lib/utils/style"
  import pDebounce from "p-debounce"

  const { simple = false } = $props()
  const ui = useInterface()
  let searchInputEl = $state<HTMLInputElement>()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) return
    if (event.altKey && event.key === "n") {
      event.preventDefault()
      ui.toggleQuickAdd()
    }
    if (event.key === "/") {
      event.preventDefault()
      searchInputEl?.focus()
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    ui.searchQuery = (event.target as HTMLInputElement).value
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<nav
  class="flex justify-between items-center p-4 mx-auto w-full h-20 border-b border-b-zinc-100 dark:border-b-zinc-900"
>
  <div>
    <Breadcrumbs />
  </div>
  <div class="flex gap-4 justify-end items-center">
    {#if !simple}
      {#if ui.textToSpeechAudioBlob && ui.aiFeaturesPreferences.tts}
        <audio controls autoplay>
          <source src={ui.textToSpeechAudioBlob} type="audio/wav" />
        </audio>
      {/if}
      <div
        class="relative rounded-md transition duration-300 focus-within:rounded-md focus-within:ring-2 focus-within:outline-none dark:focus-within:ring-zinc-800 focus-within:ring-zinc-300"
      >
        <input
          type="text"
          id="search"
          name="search"
          bind:this={searchInputEl}
          value={ui.searchQuery}
          onkeyup={pDebounce(handleKeyUp, 500)}
          spellcheck="false"
          aria-label="Search"
          class={"flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
        />
        <svg
          class="absolute top-3 left-3 size-4"
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
        <KeyboardIndicator key="/" class="absolute top-2 right-3 text-xs" />
      </div>
      <Popover.Root bind:open={ui.quickAddOpen}>
        <Tooltip.Root>
          <Popover.Trigger tabindex={-1} />
          <Tooltip.Trigger asChild>
            <div
              class="rounded-full transition duration-300 focus-within:rounded-full focus-within:ring-2 focus-within:outline-none dark:focus-within:ring-zinc-800 focus-within:ring-zinc-300"
            >
              <Button
                onclick={() => ui.toggleQuickAdd()}
                variant="outline"
                id="quickAddButton"
                class="p-0 rounded-full size-11"
              >
                <svg
                  class="pointer-events-none size-5"
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
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p class="flex justify-center items-center">
              Quick add Bookmark <KeyboardIndicator key="Alt N" class="ml-2 text-xs" />
            </p>
          </Tooltip.Content>
          <Popover.Content
            transition={blur}
            transitionConfig={{ delay: 0, duration: 250 }}
            sideOffset={15}
            alignOffset={15}
          >
            <QuickAddForm />
          </Popover.Content>
        </Tooltip.Root>
      </Popover.Root>
      <div
        class="rounded-full transition duration-300 focus-within:rounded-full focus-within:ring-2 focus-within:outline-none dark:focus-within:ring-zinc-800 focus-within:ring-zinc-300"
      >
        <!-- TODO: Fix quick-add button tooltip -->
        <Tooltip.Root>
          <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
            <Button
              builders={[tooltipBuilder]}
              variant="outline"
              class="p-0 rounded-full size-11"
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
          <Tooltip.Content transition={flyAndScale}>
            <p class="flex justify-center items-center">
              Toggle Sidebar <KeyboardIndicator key="]" class="ml-2 text-xs" />
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    {/if}
  </div>
</nav>
