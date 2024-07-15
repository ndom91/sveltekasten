<script lang="ts">
  import { ModeWatcher } from "mode-watcher"
  import { cn } from "$lib/utils/style"
  import { blur } from "svelte/transition"
  import { useDebounce } from "runed"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { Breadcrumbs, QuickAddForm } from "$lib/components/navbar"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { invalidate } from "$app/navigation"
  import { flyAndScale } from "$lib/utils/style"
  import { AudioPlayer } from "$lib/components/audio-player"

  const { showSearch = true, showQuickAdd = true, showSidebar = true } = $props()
  const ui = useInterface()
  let searchInputEl = $state<HTMLInputElement>()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) {
      return
    }

    if (event.altKey && event.key === "n") {
      event.preventDefault()
      ui.toggleQuickAdd()
    }
    if (event.key === "/") {
      event.preventDefault()
      searchInputEl?.focus()
    }
  }

  const handleSearchInput = (event: KeyboardEvent) => {
    const query = (event.target as HTMLInputElement).value
    // Reset when deleting query
    if (ui.searchQuery !== "" && query === "") {
      invalidate("app:feeds")
      invalidate("app:bookmarks")
    }
    ui.searchQuery = query
  }
</script>

<svelte:window onkeydown={handleKeyDown} />
<nav
  class="flex justify-between items-center p-4 mx-auto w-full border-b h-16 border-input dark:border-b-zinc-800"
>
  <ModeWatcher />
  <Breadcrumbs />
  <div class="flex gap-2 justify-end items-center md:gap-4">
    {#if ui.textToSpeechAudioBlob && ui.aiFeaturesPreferences.tts.enabled}
      <AudioPlayer src={ui.textToSpeechAudioBlob} />
    {/if}
    {#if showSearch}
      <div
        class="relative rounded-md transition duration-300 focus-within:rounded-md focus-within:ring-2 focus-within:outline-none dark:focus-within:ring-zinc-800 focus-within:ring-zinc-300"
      >
        <input
          type="text"
          id="search"
          name="search"
          bind:this={searchInputEl}
          value={ui.searchQuery}
          onkeyup={useDebounce(handleSearchInput, 500)}
          spellcheck="false"
          aria-label="Search"
          class="flex py-2 px-3 pl-10 w-full h-10 text-sm bg-neutral-100 dark:bg-neutral-900 rounded-md border md:pr-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
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
        <KeyboardIndicator key="/" class="hidden absolute top-2 right-3 text-xs md:block" />
      </div>
    {/if}
    {#if showQuickAdd}
      <Popover.Root bind:open={ui.quickAddOpen}>
        <Tooltip.Root>
          <Popover.Trigger tabindex={-1} />
          <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
            <div
              class="rounded-full transition duration-300 focus-within:rounded-full focus-within:ring-2 focus-within:outline-none dark:focus-within:ring-zinc-800 focus-within:ring-zinc-300"
            >
              <Button
                builders={[tooltipBuilder]}
                on:click={() => ui.toggleQuickAdd()}
                variant="outline"
                class={cn(
                  ui.quickAddOpen ? "ring-2 ring-zinc-400" : "",
                  "p-0 rounded-full size-11 transition",
                )}
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
            sideOffset={30}
            class="w-[calc(100%_-_16px)] sm:w-auto"
          >
            <QuickAddForm />
          </Popover.Content>
        </Tooltip.Root>
      </Popover.Root>
    {/if}
    {#if showSidebar}
      <div
        class="rounded-full transition duration-300 focus-within:rounded-full focus-within:ring-2 focus-within:outline-none dark:focus-within:ring-zinc-800 focus-within:ring-zinc-300"
      >
        <Tooltip.Root>
          <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
            <Button
              builders={[tooltipBuilder]}
              variant="outline"
              class={cn(
                ui.metadataSidebarOpen ? "ring-2 ring-zinc-400" : "",
                "p-0 rounded-full size-11 transition",
              )}
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
