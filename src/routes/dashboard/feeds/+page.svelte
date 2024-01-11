<script lang="ts">
  import { onDestroy } from "svelte"
  import { FeedRow } from "$lib/components/feed-row"
  import * as Table from "$lib/components/ui/table"
  import { Skeleton } from "$lib/components/ui/skeleton"

  import { useInterface } from "$state/ui.svelte"
  import EmptyIllustration from "$lib/assets/empty-state.png"
  import Arrow from "$lib/assets/arrow.svg"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { infiniteScroll } from "$lib/components/infinite-scroll"
  import type { FeedEntry } from "$zod"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let loading = $state(false)
  let totalItemCount = $state<number>(data.count ?? 1)
  let allItems = $state(data.feedEntries?.data ?? [])

  // Log error from page server loading
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
    }
  })

  onDestroy(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  // Load more items on infinite scroll
  const loadMore = async (p: number) => {
    loading = true
    pageNumber = p
    const limit = 10
    const skip = 10 * (pageNumber - 1)

    // Skip if all items already loaded
    if (allItems.length >= totalItemCount) return

    const res = await fetch(`/api/feeds?skip=${skip}&limit=${limit}`)
    const { data: additionalResults } = await res.json()
    allItems.push(...additionalResults)
    loading = false
  }

  // Handle search input
  let activeFeedEntries = $derived(async () => {
    if (!ui.searchQuery) return allItems
    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ui.searchQuery,
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
        (item: FeedEntry) => `$${item.id}` === currentActiveElement.dataset.id,
      )
      const nextIndex =
        e.key === "ArrowDown" || e.key === "j"
          ? currentActiveElementIndex + 1
          : currentActiveElementIndex - 1
      const nextElement = document.querySelector(
        `[data-id="$${allItems[nextIndex]?.id}"]`,
      ) as HTMLElement

      if (nextElement) {
        nextElement.focus()
      }
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
      <Table.Root>
        <Table.Body>
          {#await activeFeedEntries()}
            {#each Array.from({ length: 10 }) as _}
              <tr class="h-40 text-3xl">
                <td colspan="2" align="left">
                  <div class="mx-4 flex w-full items-start gap-4 p-4 opacity-10">
                    <Skeleton class="h-36 w-60 rounded-md" />
                    <div class="flex w-full flex-col items-start gap-4">
                      <Skeleton class="h-4 w-2/3" />
                      <Skeleton class="h-10 w-3/4" />
                      <Skeleton class="h-4 w-96" />
                    </div>
                  </div>
                </td>
              </tr>
            {/each}
          {:then feedEntries}
            {#if feedEntries.length}
              {#each feedEntries as feedEntry}
                <FeedRow {feedEntry} />
              {/each}
              <div
                bind:this={elementRef}
                class="grid h-24 w-full place-items-center text-xl font-light"
              >
                Loading...
              </div>
            {:else}
              <tr class="text-3xl">
                <td colspan="2" class="h-24" align="center">No entries found</td>
              </tr>
            {/if}
          {:catch error}
            <tr class="text-3xl">
              <td colspan="2" class="h-24" align="center">{error}</td>
            </tr>
          {/await}
        </Table.Body>
      </Table.Root>
    {:else}
      <img src={Arrow} alt="Arrow" class="absolute right-28 top-28" />
      <div class="relative mx-auto w-1/2">
        <img src={EmptyIllustration} alt="Empty" />
        <p class="mb-4 text-center text-2xl font-light">Looks like there's nothing here!</p>
        <p class="text-center text-muted-foreground">
          Get started by adding a bookmark with the "+" button above or by pressing <KeyboardIndicator
            class="text-sm text-white"
            key="Alt N"
          />
        </p>
      </div>
    {/if}
  </div>
</main>
