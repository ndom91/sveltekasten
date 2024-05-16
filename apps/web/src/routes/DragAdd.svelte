<script lang="ts">
  import { z } from "zod"
  import { toast } from "svelte-sonner"
  import ConfirmAddDialog from "./ConfirmAddDialog.svelte"
  import { cn } from "$/lib/utils/style"

  const parseData = (text: string | undefined): string | void => {
    try {
      const rawUrl = z.string().url().parse(text)
      return rawUrl
    } catch (error) {
      toast.error("Paste failed - invalid URL")
    }
  }

  let isDragOver = $state(false)
  let showConfirmAddDialog = $state(false)
  let url = $state("")

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.relatedTarget) {
      return
    }
    isDragOver = true
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragOver = false

    const text = e.dataTransfer?.getData("text/plain")
    const parsedUrl = parseData(text)
    if (parsedUrl) {
      const parsedHostname = new URL(parsedUrl).hostname

      // Ignore invalid URLs and URLs from the same domain
      if (!parsedHostname) {
        return
      }
      if (parsedHostname === location.hostname) {
        return
      }

      url = parsedUrl
      showConfirmAddDialog = true
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    if (e.target instanceof HTMLInputElement) {
      return
    }
    const text = e.clipboardData?.getData("text/plain")
    const parsedUrl = parseData(text)
    if (parsedUrl) {
      url = parsedUrl
      showConfirmAddDialog = true
    }
  }

  // Allow closing dropover backdrop with ESC
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) {
      return
    }
    if (e.key === "Escape" && showConfirmAddDialog) {
      e.preventDefault()
      showConfirmAddDialog = false
    }
  }

  // Hide drop backdrop after 4s
  $effect(() => {
    if (isDragOver) {
      setTimeout(() => {
        isDragOver = false
      }, 4000)
    }
  })
</script>

<svelte:window
  onkeydown={handleKeyDown}
  onpaste={handlePaste}
  ondragenter={handleDragEnter}
  ondragover={e => e.preventDefault()}
/>

<ConfirmAddDialog {url} bind:open={showConfirmAddDialog} />

<div
  role="region"
  aria-hidden="true"
  class={cn(
    "grid fixed inset-0 z-50 place-items-center bg-black transition duration-500 bg-opacity-0 backdrop-blur-sm p-8",
    isDragOver ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  )}
>
  <div
    role="region"
    aria-hidden="true"
    class="grid place-items-center p-12 m-12 w-full h-full rounded-lg border-4 border-black border-opacity-75 border-dashed dark:border-white"
    ondragover={e => e.preventDefault()}
    ondrop={handleDrop}
  >
    <span class="text-3xl">Drop Here</span>
  </div>
</div>
