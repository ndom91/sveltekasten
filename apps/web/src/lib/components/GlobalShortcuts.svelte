<script lang="ts">
import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
import { goto } from "$app/navigation"

let element = $state<HTMLDialogElement | undefined>()

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.repeat || e.target instanceof HTMLInputElement) {
    return
  }
  if (e.key === "Escape" && element) {
    e.preventDefault()
    element.close()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "/") {
    e.preventDefault()
    element?.showModal()
  }
  if (e.shiftKey && e.key === "!") {
    e.preventDefault()
    goto("/")
  }
  if (e.shiftKey && e.key === "@") {
    e.preventDefault()
    goto("/bookmarks")
  }
  if (e.shiftKey && e.key === "#") {
    e.preventDefault()
    goto("/feeds")
  }
  if (e.shiftKey && e.key === "$") {
    e.preventDefault()
    goto("/archives")
  }
  if (e.shiftKey && e.key === "%") {
    e.preventDefault()
    goto("/categories")
  }
  if (e.shiftKey && e.key === "^") {
    e.preventDefault()
    goto("/tags")
  }
  if (e.shiftKey && e.key === "&") {
    e.preventDefault()
    goto("/settings")
  }
}
</script>

<svelte:window onkeydown={handleKeyDown} />

<KeyboardShortcutsHelp bind:dialogElement={element} />
