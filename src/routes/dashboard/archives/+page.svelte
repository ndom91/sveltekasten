<script lang="ts">
  import toast from "svelte-french-toast"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { infiniteScroll } from "$lib/components/infinite-scroll"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let totalItemCount = $state<number>(data.bookmarks.count ?? 1)
  let allItems = $state(data.bookmarks.data ?? [])

  $effect(() => {
    allItems = data.bookmarks.data ?? []
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

  // Load more items on infinite scroll
  const loadMore = async (p: number) => {
    pageNumber = p
    const limit = 10
    const skip = 10 * (pageNumber - 1)

    // Skip if all items already loaded
    if (allItems.length >= totalItemCount) return

    const res = await fetch(`/api/v1/bookmarks?skip=${skip}&limit=${limit}`)
    const { data } = await res.json()
    if (data) {
      allItems.push(...data)
    }
  }

  let activeBookmarks: () => Promise<(typeof allItems)[]> = $derived(async () => {
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
          archived: true,
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
    const { data: searchResults, count } = await res.json()
    totalItemCount = count
    return searchResults
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

<main class="h-full">
  <div class="align-start flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2">
    {#if data.bookmarks.data}
      <div class="overflow-y-scroll h-full">
        {#await activeBookmarks()}
          <div class="my-8 w-full text-3xl text-center">Loading...</div>
        {:then bookmarks}
          {#each bookmarks as bookmark}
            <BookmarkRow {bookmark} />
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

{#snippet emptyHelper()}
  <EmptyState arrow={false} />
{/snippet}
