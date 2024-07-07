<script lang="ts">
  import { Toaster, toast } from "svelte-sonner"
  import { type Snippet, onMount, setContext } from "svelte"
  import MediaQuery from "$lib/components/MediaQuery.svelte"
  import DragAdd from "./DragAdd.svelte"
  import Scripts from "./Scripts.svelte"
  import Shortcuts from "./GlobalShortcuts.svelte"
  import type { LayoutData } from "./$types"

  import { invalidateAll, onNavigate } from "$app/navigation"
  import { browser } from "$app/environment"
  import { defaultAISettings, useInterface } from "$state/ui.svelte"
  import { useBookmarks } from "$state/bookmarks.svelte"
  import "$lib/styles/global.css"

  const bookmarkStore = useBookmarks()
  setContext("bookmarks", bookmarkStore)

  const ui = useInterface()

  const { data, children }: { data: LayoutData; children: Snippet } = $props()

  // Set current user preferences to store
  ui.aiFeaturesPreferences = data.session?.user?.settings?.ai ?? defaultAISettings
  ui.userSettings = data.session?.user?.settings?.personal ?? {}

  // Global View transition
  onNavigate((navigation: { complete: any }) => {
    // @ts-expect-error New method, only available in Chromium
    if (!document.startViewTransition) {
      return
    }

    return new Promise<void>((resolve) => {
      // @ts-expect-error New method, only available in Chromium
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })

  onMount(() => {
    if (browser && "serviceWorker" in navigator) {
      navigator.serviceWorker.register(
        // @ts-expect-error - its fine, we're not transpiling to cjs
        import.meta.env.MODE === "production" ? "/service-worker.js" : "/dev-sw.js?dev-sw",
        // @ts-expect-error - its fine, we're not transpiling to cjs
        { type: import.meta.env.MODE === "production" ? "classic" : "module" },
      )

      // navigator.serviceWorker.addEventListener("message", (event) => {
      //   // TODO: invalidate cache once items been added
      //   if (event.data.type === "SHARE_SUCCESS") {
      //     toast.success(`sw.eventListener: ${event.data}`)
      //     console.log("sw.eventListener:", event.data)
      //   }
      // })
    }

    if (navigator.serviceWorker.controller) {
      console.log("This page is currently controlled by:", navigator.serviceWorker.controller)
      navigator.serviceWorker.startMessages()
      navigator.serviceWorker.onmessage = (event) => {
        toast.success(`sw.onmessage0: ${JSON.stringify(event.data)}`)
        if (event.data.type === "SHARE_SUCCESS") {
          toast.success(`sw.onmessage1: ${JSON.stringify(event.data)}`)
          // TODO: invalidate cache once items been added
          invalidateAll()
          console.log("sw.onmessage:", JSON.stringify(event.data))
          document.querySelector("#dashboard-bookmark-row")?.scrollTo(0, 0)
          // {
          //   top: 0,
          //   left: 0,
          //   behavior: "smooth",
          // })
        }
      }
    }
  })
</script>

<svelte:head>
  <title>BriefButler</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Scripts />

<Shortcuts />

<MediaQuery query="(max-width: 767px)">
  {#snippet children(matches)}
    {#if matches}
      <Toaster
        class="toaster group"
        position="top-left"
        toastOptions={{
          class:
            "bg-white/20 backdrop-blur-md dark:bg-neutral-700/20 dark:text-white dark:border-gray-400/10 border border-gray-200/70",
        }}
      />
    {:else}
      <Toaster
        class="toaster group"
        toastOptions={{
          class:
            "bg-white/20 backdrop-blur-md dark:bg-neutral-700/20 dark:text-white dark:border-gray-400/10 border border-gray-200/70",
        }}
      />
    {/if}
  {/snippet}
</MediaQuery>

{@render children()}

<DragAdd />
