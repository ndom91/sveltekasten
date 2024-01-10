<script lang="ts">
  import { onDestroy } from "svelte"
  import { FeedRow } from "$lib/components/feed-row"
  import * as Table from "$lib/components/ui/table"

  import { useInterface } from "$state/ui.svelte"
  import EmptyIllustration from "$lib/assets/empty-state.png"
  import Arrow from "$lib/assets/arrow.svg"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { infiniteScroll } from "$lib/components/InfiniteScroll"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let loading = $state(false)
  let totalItemCount = $state<number>(data.count ?? 1)
  let allItems = $state(data.feedEntries ?? [])

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

    // TODO: Stop fetching when `allItems >= count.roundUp(10)`
    const res = await fetch("/api/feeds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit,
        skip,
      }),
    })
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
</script>

<svelte:head>
  <title>Briefkasten | Feeds</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<main class="h-full">
  <div class="align-start flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2">
    {#if data.feedEntries}
      <Table.Root>
        <Table.Body>
          {#await activeFeedEntries()}
            <tr class="text-3xl">
              <td colspan="2" class="h-24" align="center">Loading...</td>
            </tr>
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
