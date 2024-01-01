<script lang="ts">
  import { blur } from "svelte/transition"
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { QuickAddForm } from "$lib/components/navbar"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { Plus, ArrowBigLeftDash, ArrowBigRightDash } from "lucide-svelte"
  import { createUI } from "$state/ui.svelte"

  const ui = createUI()
  let open = false

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    if (event.altKey && event.code === "KeyN") {
      open = !open
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<nav class="mx-auto flex w-full items-center justify-end gap-4 p-4">
  <Popover.Root {open}>
    <Tooltip.Root>
      <Popover.Trigger asChild let:builder={popoverBuilder}>
        <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
          <Button
            builders={[popoverBuilder, tooltipBuilder]}
            variant="outline"
            class="size-11 rounded-full p-0"
          >
            <Plus class="size-4" />
          </Button>
        </Tooltip.Trigger>
      </Popover.Trigger>
      <Tooltip.Content>
        <p>Quick add Bookmark</p>
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
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
      <Button
        builders={[tooltipBuilder]}
        variant="ghost"
        class="size-11 rounded-full p-0"
        on:click={ui.toggleMetadataSidebar}
      >
        {#if ui.metadataSidebarOpen}
          <ArrowBigLeftDash class="size-6" />
        {:else}
          <ArrowBigRightDash class="size-6" />
        {/if}
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>
        Toggle Sidebar <KeyboardIndicator key="]" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
</nav>
