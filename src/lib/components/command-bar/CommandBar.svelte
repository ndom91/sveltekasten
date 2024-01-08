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
    if ((event.ctrlKey || event.metaKey) && event.code === "KeyD") {
      event.preventDefault()
      goto("/dashboard")
    }
    if ((event.ctrlKey || event.metaKey) && event.code === "KeyC") {
      event.preventDefault()
      goto("/dashboard/categories")
    }
    if ((event.ctrlKey || event.metaKey) && event.code === "KeyT") {
      event.preventDefault()
      goto("/dashboard/tags")
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
        Dashboard <KeyboardIndicator class="text-xs" key="⌘D" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/categories")} class="flex justify-between">
        Categories <KeyboardIndicator class="text-xs" key="⌘C" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/tags")} class="flex justify-between">
        Tags <KeyboardIndicator class="text-xs" key="⌘T" />
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
