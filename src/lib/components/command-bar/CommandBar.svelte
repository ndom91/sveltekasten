<script lang="ts">
  import * as Command from "$lib/components/ui/command"
  import { goto } from "$app/navigation"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { toggleMode } from "mode-watcher"

  const ui = useInterface()

  let isCommandOpen = false

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) return
    if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
      event.preventDefault()
      isCommandOpen = !isCommandOpen
    }
  }

  const openQuickAdd = () => {
    isCommandOpen = false
    ui.toggleQuickAdd()
  }

  const toggleDarkMode = () => {
    isCommandOpen = false
    toggleMode()
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<Command.Dialog bind:open={isCommandOpen} label="Command Menu2" loop>
  <Command.Input type="command-input" placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Pages">
      <Command.Item onSelect={() => goto("/dashboard")} class="flex justify-between">
        Dashboard <KeyboardIndicator class="text-xs" key="Shift + 1" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/dashboard/feeds")} class="flex justify-between">
        Feeds <KeyboardIndicator class="text-xs" key="Shift + 2" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/dashboard/categories")} class="flex justify-between">
        Categories <KeyboardIndicator class="text-xs" key="Shift + 3" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/dashboard/tags")} class="flex justify-between">
        Tags <KeyboardIndicator class="text-xs" key="Shift + 4" />
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Actions">
      <Command.Item onSelect={toggleDarkMode}>Toggle Dark Mode</Command.Item>
      <Command.Item onSelect={openQuickAdd}>New Bookmark</Command.Item>
      <Command.Item>Delete Bookmark</Command.Item>
      <Command.Item>Edit Bookmark</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
