<script lang="ts">
  import toast from "svelte-french-toast"
  import { ofetch } from "ofetch"
  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { InfiniteLoader, loaderState } from "svelte-infinite"
  import { untrack, onDestroy } from "svelte"

  const ui = useInterface()
  const { data = $bindable() }: { data: any } = $props()

  let pageNumber = $state(0)
  let allItems = $state<LoadBookmarkFlatTags[]>(data.bookmarks.data!)
  let rootElement = $state<HTMLElement>()

  const limitLoadCount = 20

  $effect(() => {
    allItems = data.bookmarks.data!
  })

  if (data.error) {
    console.error(String(data.error))
  }

  const fetchSearchResults = async ({
    limit = limitLoadCount,
    skip = 0,
  }: {
    limit?: number
    skip?: number
  }) => {
    try {
      const body = {
        type: "bookmark",
        skip,
        limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        where: {
          archived: true,
        },
      }
      if (ui.searchQuery) {
        body.where = {
          archived: true,
          title: {
            search: ui.searchQuery,
          },
          url: {
            search: ui.searchQuery,
          },
          desc: {
            search: ui.searchQuery,
          },
        }
      }
      const { data, count } = await ofetch("/api/v1/search", {
        method: "POST",
        body,
      })
      return {
        data,
        count,
      }
    } catch (error) {
      console.error(String(error))
      toast.error(String(error))
    }
  }

  // Load more items on infinite scroll
  const loadMore = async () => {
    try {
      pageNumber += 1
      const limit = limitLoadCount
      const skip = limitLoadCount * pageNumber

      const searchResults = await fetchSearchResults({ limit, skip })
      if (!searchResults?.data) {
        pageNumber -= 1
        return
      }

      if (searchResults.data.length) {
        allItems.push(...(searchResults.data as any[]))
      }

      if (allItems.length >= searchResults.count) {
        loaderState.complete()
      } else {
        loaderState.loaded()
      }
    } catch (error) {
      console.error(String(error))

      loaderState.error()
      pageNumber -= 1
    }
  }

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

  // Handle search input changes
  // Reset and execute first search for new query
  $effect.pre(() => {
    ui.searchQuery
    untrack(() => {
      loaderState.reset()
      pageNumber = -1
      allItems = []
      loadMore()
    })
  })

  // Reset state on unmount
  onDestroy(() => {
    if (ui.searchQuery) {
      ui.searchQuery = ""
    }
  })
</script>

<svelte:head>
  <title>Briefkasten | Bookmarks</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<Navbar />
<main
  class="align-start overflow-y-scroll flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2"
>
  {#if data.bookmarks?.count}
    <div class="h-full">
      <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
        {#each allItems as item, i (item.id)}
          <BookmarkRow bind:bookmark={allItems[i]} />
        {/each}
      </InfiniteLoader>
    </div>
  {:else}
    <EmptyState showArrow={false} />
    <div class="w-full text-center text-muted-foreground">
      Try archiving a <a class="underline underline-offset-4" href="/bookmarks">bookmark</a>
    </div>
  {/if}
</main>
