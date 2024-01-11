<script lang="ts">
  import { onDestroy } from "svelte"
  import * as Table from "$lib/components/ui/table"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { infiniteScroll } from "$lib/components/infinite-scroll"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let totalItemCount = $state<number>(data.count ?? 1)
  let loading = $state(false)
  let allItems = $state(data.bookmarks ?? [])

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

    const res = await fetch("/api/bookmarks", {
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

  let activeBookmarks = $derived(async () => {
    if (!ui.searchQuery) return allItems
    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ui.searchQuery,
        type: "bookmark",
      }),
    })
    const { data: searchResults, count } = await res.json()
    totalItemCount = count
    return searchResults
  })
</script>

<svelte:head>
  <title>Briefkasten | Bookmarks</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
<main class="h-full">
  <div class="align-start flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2">
    {#if data.bookmarks}
      <Table.Root>
        <Table.Body>
          {#await activeBookmarks()}
            <tr class="text-3xl">
              <td colspan="2" class="h-24" align="center">Loading...</td>
            </tr>
          {:then bookmarks}
            {#if bookmarks.length}
              {#each bookmarks as bookmark}
                <BookmarkRow {bookmark} />
              {/each}
              <div bind:this={elementRef} class="h-24 w-full" />
            {:else}
              <EmptyState />
            {/if}
          {:catch error}
            <tr class="text-3xl">
              <td colspan="2" class="h-24" align="center">{error}</td>
            </tr>
          {/await}
        </Table.Body>
      </Table.Root>
    {:else}
      <EmptyState />
    {/if}
  </div>
</main>
