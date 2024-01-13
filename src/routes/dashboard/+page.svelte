<script lang="ts">
  import { onDestroy } from "svelte"
  import * as Table from "$lib/components/ui/table"
  import type { ComponentProps } from 'svelte';
  import EmptyState from "$lib/components/EmptyState.svelte"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { infiniteScroll } from "$lib/components/infinite-scroll"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let totalItemCount = $state<number>(data.count ?? 1)
  let loading = $state(false)
  let allItems = $state(data.bookmarks ?? [])

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

  let activeBookmarks: () => Promise<typeof allItems[]> = $derived(async () => {
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
              <p class="mx-auto w-1/2 text-center text-muted-foreground">
                Get started by adding a bookmark with the
                <svg
                  class="size-7 inline rounded-md p-1 dark:bg-zinc-700"
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
      <p class="mx-auto w-1/2 text-center text-muted-foreground">
        Get started by adding a bookmark with the
        <svg
          class="size-7 inline rounded-md p-1 dark:bg-zinc-700"
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
    {/if}
  </div>
</main>
