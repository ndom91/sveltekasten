<script lang="ts">
  import { cn } from "$lib/utils/style"
  import { Button } from "$lib/components/ui/button"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { useInterface } from "$state/ui.svelte"

  const ui = useInterface()

  export let isOptionsOpen: boolean
  export let url: string
  export let handleToggleCardOpen: () => void
  export let handleMarkAsUnread: (target?: boolean) => void
  export let handleSetTextToSpeechContent: () => void
</script>

<div
  class={cn(
    "absolute right-4 top-10 flex rounded-xl bg-zinc-200 bg-opacity-90 p-2 text-white transition-opacity delay-200 duration-300 ease-in-out dark:bg-zinc-700 dark:bg-opacity-100",
    isOptionsOpen ? "opacity-100" : "opacity-0",
  )}
>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
      <Button
        builders={[tooltipBuilder]}
        variant="ghost"
        size="icon"
        on:click={handleToggleCardOpen}
      >
        <svg
          class="size-5 text-zinc-900 dark:text-zinc-100"
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
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          ></path>
        </svg>
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>
        Read Inline
        <KeyboardIndicator key="&bsol;" class="ml-2" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
      <Button
        builders={[tooltipBuilder]}
        variant="ghost"
        size="icon"
        on:click={() => handleMarkAsUnread()}
      >
        <svg
          class="size-5 text-zinc-900 dark:text-zinc-100"
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
            d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
          ></path>
        </svg>
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>
        Mark as Read
        <KeyboardIndicator key="u" class="ml-2" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
      <Button
        builders={[tooltipBuilder]}
        variant="ghost"
        size="icon"
        on:click={handleSetTextToSpeechContent}
      >
        {#if ui.textToSpeechLoading}
          <LoadingIndicator class="dark:text-white" />
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
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            ></path>
          </svg>
        {/if}
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>
        Read Aloud
        <KeyboardIndicator key="u" class="ml-2" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
      <Button builders={[tooltipBuilder]} variant="ghost" size="icon" href={url} target="_blank">
        <svg
          class="size-5 text-zinc-900 dark:text-zinc-100"
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
            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
          ></path>
        </svg>
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>
        Open Link
        <KeyboardIndicator key="o" class="ml-2" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
</div>
