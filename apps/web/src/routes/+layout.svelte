<script lang="ts">
  import { z } from "zod"
  import { dev } from "$app/environment"
  import { page } from "$app/stores"
  import toast from "svelte-french-toast"
  // import { Toaster } from "$lib/components/ui/sonner"
  import { Toaster } from "svelte-french-toast"
  import { partytownSnippet } from "@builder.io/partytown/integration"
  import { cn } from "$lib/utils/style"
  import { goto, onNavigate } from "$app/navigation"
  import ConfirmAddDialog from "./ConfirmAddDialog.svelte"
  import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
  import "$lib/styles/global.css"

  // View transition
  onNavigate((navigation) => {
    // @ts-expect-error New method, only available in Chromium
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      // @ts-expect-error New method, only available in Chromium
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })

  let showKeyboardShortcuts = $state(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) return
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault()
      showKeyboardShortcuts = !showKeyboardShortcuts
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

  const parsePassedData = (text: string | undefined): string | void => {
    try {
      const rawUrl = z.string().url().parse(text)
      return rawUrl
    } catch (error) {
      console.error(`Got invalid paste content: "${text}"`)
      toast.error("Paste failed - invalid URL")
    }
  }

  let isDragOver = $state(false)
  let showConfirmAddDialog = $state(false)
  let url = $state("")

  $effect(() => {
    if (isDragOver) {
      setTimeout(() => {
        isDragOver = false
      }, 4000)
    }
  })

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("DragEnter", e)
    // TODO: Ensure dragging stuff from the page doesn't trigger drag-n-drop overlay
    if (e.relatedTarget) return
    isDragOver = true
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragOver = false

    const text = e.dataTransfer?.getData("text/plain")
    const parsedUrl = parsePassedData(text)
    if (parsedUrl) {
      url = parsedUrl
      showConfirmAddDialog = true
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    if (e.target instanceof HTMLInputElement) return
    const text = e.clipboardData?.getData("text/plain")
    const parsedUrl = parsePassedData(text)
    if (parsedUrl) {
      url = parsedUrl
      showConfirmAddDialog = true
    }
  }
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
  {#if !dev && $page.url.hostname === 'dev.briefkastenhq.com'}
    <script>
      partytown = {
        forward: ["plausible"],
      }
    </script>
    {@html "<script>" + partytownSnippet() + "</script>"}

    <script
      type="text/partytown"
      src="/p.js"
      data-domain="dev.briefkastenhq.com"
      data-api="/add/event"
    ></script>
  {/if}
</svelte:head>

<svelte:window
  onkeydown={handleKeyDown}
  onpaste={handlePaste}
  ondragenter={handleDragEnter}
  ondragover={(e) => e.preventDefault()}
/>

<ConfirmAddDialog {url} bind:open={showConfirmAddDialog} />

{#if showKeyboardShortcuts}
  <KeyboardShortcutsHelp bind:open={showKeyboardShortcuts} />
{/if}

<Toaster
  position="bottom-right"
  toastOptions={{ style: "background-color: #111111; color: #fff" }}
/>

<slot />

<div
  role="region"
  aria-hidden="true"
  class={cn(
    "grid fixed inset-0 z-50 place-items-center bg-black transition duration-500 bg-opacity-30 backdrop-blur-sm",
    isDragOver ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  )}
>
  <div
    role="region"
    aria-hidden="true"
    class="w-[95%] h-[95%] border-4 border-dashed border-white border-opacity-50 grid place-items-center rounded-lg"
    ondragover={(e) => e.preventDefault()}
    ondrop={handleDrop}
  >
    <span class="text-2xl">Drop Here</span>
  </div>
</div>
