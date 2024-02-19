<script lang="ts">
  import toast from "svelte-french-toast"
  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { infiniteScroll } from "$lib/components/infinite-scroll"
  import { Logger, loggerLevels } from "$lib/utils/logger"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let totalItemCount = $state<number>(data.count ?? 1)
  let allItems = $state<LoadBookmarkResult[]>(data.bookmarks!)
  const logger = new Logger({ level: loggerLevels.DEBUG })

  $effect(() => {
    allItems = data.bookmarks ?? []
  })

  if (data.error) {
    console.error(data.error)
  }

  // Setup infinite scrolling
  let elementRef = $state<HTMLElement>()
  let observer: IntersectionObserver | null = $state(null)

  $effect(() => {
    if (elementRef) {
      observer = infiniteScroll({
        fetch: () => loadMore(pageNumber + 1),
        element: elementRef,
      })
      return () => observer?.disconnect()
    }
  })

  // TODO: Scroll / highlight previous story again
  // See: https://svelte-5-preview.vercel.app/docs/old-vs-new#autoscroll
  // Load more items on infinite scroll
  const loadMore = async (p: number) => {
    pageNumber = p
    const limit = 10
    const skip = 10 * (pageNumber - 1)

    // Skip if all items already loaded
    if (allItems.length >= totalItemCount) return

    const res = await fetch(`/api/v1/bookmarks?skip=${skip}&limit=${limit}`)
    const { data: additionalResults } = await res.json()
    allItems.push(...additionalResults)
  }

  let activeBookmarks: () => Promise<LoadBookmarkResult[]> = $derived(async () => {
    if (!ui.searchQuery) return allItems
    const res = await fetch("/api/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "bookmark",
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        where: {
          OR: [
            {
              title: {
                contains: `%${ui.searchQuery}%`,
                mode: "insensitive",
              },
            },
            {
              url: {
                contains: `%${ui.searchQuery}%`,
                mode: "insensitive",
              },
            },
            {
              desc: {
                contains: `%${ui.searchQuery}%`,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    })
    const { data, count } = await res.json()
    totalItemCount = count
    return data
  })
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "j" || e.key === "k") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = allItems.findIndex(
        (item) => item.id === currentActiveElement.dataset.id,
      )
      const nextIndex =
        e.key === "ArrowDown" || e.key === "j"
          ? currentActiveElementIndex + 1
          : currentActiveElementIndex - 1
      const nextElement = document.querySelector(
        `[data-id="${allItems[nextIndex]?.id}"]`,
      ) as HTMLElement

      if (nextElement) {
        nextElement.focus()
      }
    }
    if (e.key === "o") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = allItems.findIndex(
        (item) => item.id === currentActiveElement.dataset.id,
      )
      const targetLink = allItems[currentActiveElementIndex]?.url
      if (!targetLink) {
        toast.error("No item selected", { icon: "🚫" })
        return
      }
      window.open(targetLink, "_target")
    }
  }
</script>

<svelte:head>
  <title>Briefkasten | Bookmarks</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<Navbar />
<div class="flex overflow-y-scroll flex-col">
  <main class="h-full">
    <div class="align-start flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2">
      {#if data.bookmarks}
        <div class="overflow-y-scroll h-full">
          {#await activeBookmarks()}
            <div class="my-8 w-full text-3xl text-center">Loading...</div>
          {:then bookmarks}
            {#each bookmarks as bookmark, i}
              <BookmarkRow bind:bookmark={bookmarks[i]} />
            {:else}
              {@render emptyHelper()}
            {/each}
            <div bind:this={elementRef} class="w-full h-24" />
          {:catch error}
            <div class="my-4 w-full text-3xl text-center">
              {error}
            </div>
          {/await}
        </div>
      {:else}
        {@render emptyHelper()}
      {/if}
    </div>
  </main>
</div>

{#snippet emptyHelper()}
  <EmptyState />
  <p class="mx-auto w-1/2 text-center text-muted-foreground">
    Get started by adding a bookmark with the
    <svg
      class="inline p-1 rounded-md size-7 dark:bg-zinc-700"
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
        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
      ></path>
    </svg>
    button above or by pressing <KeyboardIndicator class="text-sm" key="Alt N" />
  </p>
{/snippet}
