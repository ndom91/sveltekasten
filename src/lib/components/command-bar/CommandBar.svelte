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
    <Command.Group heading="Actions">
      <Command.Item onSelect={toggleDarkMode}>Toggle Dark Mode</Command.Item>
      <Command.Item onSelect={openQuickAdd}>New Bookmark</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Pages">
      <Command.Item onSelect={() => goto("/")} class="flex justify-between">
        Dashboard <KeyboardIndicator class="text-xs" key="Shift + 1" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/bookmarks")} class="flex justify-between">
        Bookmarks <KeyboardIndicator class="text-xs" key="Shift + 2" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/feeds")} class="flex justify-between">
        Feeds <KeyboardIndicator class="text-xs" key="Shift + 3" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/archives")} class="flex justify-between">
        Archive <KeyboardIndicator class="text-xs" key="Shift + 4" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/categories")} class="flex justify-between">
        Categories <KeyboardIndicator class="text-xs" key="Shift + 5" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/tags")} class="flex justify-between">
        Tags <KeyboardIndicator class="text-xs" key="Shift + 6" />
      </Command.Item>
      <Command.Item onSelect={() => goto("/settings")} class="flex justify-between">
        Settings <KeyboardIndicator class="text-xs" key="Shift + 7" />
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
