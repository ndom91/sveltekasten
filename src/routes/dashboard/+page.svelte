<script lang="ts">
  import { onDestroy } from "svelte"
  import { goto } from "$app/navigation"
  import * as Table from "$lib/components/ui/table"
  import * as Pagination from "$lib/components/ui/pagination"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import EmptyIllustration from "$lib/assets/empty-state.png"
  import Arrow from "$lib/assets/arrow.svg"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { infiniteScroll } from "$lib/components/InfiniteScroll"

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

  // const handlePageChange = (p: number) => {
  //   console.log("handlePageChange.page", p)
  //   pageNumber = p
  //   const limit = 10
  //   const skip = (pageNumber - 1) * limit
  //   goto(`?skip=${skip}`, {
  //     noScroll: true,
  //     keepFocus: true,
  //   })
  // }
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
              <tr class="text-3xl">
                <td colspan="2" class="h-24" align="center">No bookmarks found</td>
              </tr>
            {/if}
          {:catch error}
            <tr class="text-3xl">
              <td colspan="2" class="h-24" align="center">{error}</td>
            </tr>
          {/await}
        </Table.Body>
      </Table.Root>
      <div class="fixed bottom-8 flex w-full justify-center">
        {#if totalItemCount / 10 > 1}
          <Pagination.Root
            class="w-auto rounded-xl border-2 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-950"
            count={totalItemCount}
            perPage={10}
            page={pageNumber}
            onPageChange={handlePageChange}
            let:pages
            let:currentPage
          >
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.PrevButton />
              </Pagination.Item>
              {#each pages as page (page.key)}
                {#if page.type === "ellipsis"}
                  <Pagination.Item>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                {:else}
                  <Pagination.Item>
                    <Pagination.Link {page} isActive={currentPage == page.value}>
                      {page.value}
                    </Pagination.Link>
                  </Pagination.Item>
                {/if}
              {/each}
              <Pagination.Item>
                <Pagination.NextButton />
              </Pagination.Item>
            </Pagination.Content>
          </Pagination.Root>
        {/if}
      </div>
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
