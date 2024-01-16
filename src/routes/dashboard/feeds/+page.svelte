<script lang="ts">
  import toast from "svelte-french-toast"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { FeedRow } from "$lib/components/feed-row"
  import { Skeleton } from "$lib/components/ui/skeleton"

  import { useInterface } from "$state/ui.svelte"
  import { infiniteScroll } from "$lib/components/infinite-scroll"
  import type { Feed, FeedEntry, FeedEntryMedia } from "$zod"
  import { invalidateAll } from "$app/navigation"
  import { documentVisibilityStore } from "$lib/utils/documentVisibility"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let totalItemCount = $state<number>(data.feedEntries?.count ?? 1)
  let allItems = $state<(FeedEntry & { feed: Feed; feedMedia: FeedEntryMedia })[]>(
    data.feedEntries?.data ?? [],
  )

  // Reload feed when coming back to tab
  const visibility = documentVisibilityStore()
  let prevVisibility: DocumentVisibilityState = "visible"

  $effect(() => {
    if (prevVisibility === "hidden" && $visibility === "visible") {
      invalidateAll()
    }
    prevVisibility = $visibility
  })

  // Update local state when load fn data has changed
  $effect(() => {
    allItems = data.feedEntries?.data ?? []
  })

  // Log error from page server loading
  if (data.error) {
    console.error(data.error)
  }

  // Infinite scrolling
  let elementRef = $state<HTMLElement>()
  let listWrapperEl = $state<HTMLElement>()
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

    if (
      // Skip if all items already loaded
      allItems.length >= totalItemCount ||
      // Skip if list is less than window to avoid loop
      (listWrapperEl && listWrapperEl.scrollHeight < window.innerHeight)
    )
      return

    const res = await fetch(`/api/feeds?skip=${skip}&limit=${limit}`)
    const { data: additionalResults } = await res.json()
    allItems.push(...additionalResults)
  }

  // Handle search input
  let activeFeedEntries = $derived(async () => {
    if (!ui.searchQuery)
      return allItems
        .filter((item) => {
          if (ui.showUnreadOnly) {
            return !!item.unread
          } else {
            return item
          }
        })
        .filter((item) => {
          const feed = data.feeds?.data?.find((feed) => feed.id === item.feed?.id)
          return feed?.visible
        })
    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "feedEntry",
        include: {
          feed: true,
          feedMedia: true,
        },
        orderBy: { published: "desc" },
        where: {
          title: {
            search: ui.searchQuery,
          },
          content: {
            search: ui.searchQuery,
          },
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
      const targetLink = allItems[currentActiveElementIndex]?.link
      if (!targetLink) {
        toast.error("No item selected")
        return
      }
      window.open(targetLink, "_target")
    }
  }
</script>

<svelte:head>
  <title>Briefkasten | Feeds</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<main class="h-full">
  <div class="align-start flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start">
    {#if data.feedEntries?.count > 0}
      <div bind:this={listWrapperEl} class="overflow-scroll h-full">
        {#await activeFeedEntries()}
          {#each Array.from({ length: 10 }) as _}
            <div class="h-40 text-3xl">
              <div class="flex gap-4 items-start p-4 mx-4 w-full opacity-10">
                <Skeleton class="w-72 h-32 rounded-md" />
                <div class="flex flex-col gap-4 items-start w-full">
                  <Skeleton class="w-3/4 h-4 min-w-[300px]" />
                  <Skeleton class="w-4/5 h-10 min-w-[400px]" />
                  <Skeleton class="w-96 h-4 min-w-[100px]" />
                </div>
              </div>
            </div>
          {/each}
        {:then feedEntries}
          {#each feedEntries as feedEntry}
            <FeedRow {feedEntry} />
          {:else}
            <div class="my-8 w-full text-3xl text-center">No entries found</div>
          {/each}
          <div bind:this={elementRef} class="w-full h-48 text-xl font-light" />
        {:catch error}
          <div class="my-4 w-full text-3xl text-center">
            {error}
          </div>
        {/await}
      </div>
    {:else}
      <EmptyState />
      <p class="mx-auto w-1/2 text-center text-muted-foreground">
        Get started by adding a feed in <a class="underline" href="/settings">settings</a>
      </p>
    {/if}
  </div>
</main>
