<script lang="ts">
  import { ofetch } from "ofetch"
  import { getContext, onDestroy } from "svelte"
  import { InfiniteLoader, loaderState } from "svelte-infinite"
  import { toast } from "svelte-sonner"
  import { Logger, loggerLevels } from "$/lib/utils/logger"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { Navbar } from "$lib/components/navbar"
  import { useInterface } from "$state/ui.svelte"
  import { page } from "$app/stores"

  const ui = useInterface()
  const bookmarkStore = getContext<BookmarkContext>("bookmarks")

  let pageNumber = $state(0)
  const rootElement = $state<HTMLElement>()

  const limitLoadCount = 20
  const logger = new Logger({ level: loggerLevels.DEBUG })

  $effect(() => {
    bookmarkStore.bookmarks = $page.data.bookmarks.data
  })

  if ($page.data.error) {
    logger.error(String($page.data.error))
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
        } as Record<string, unknown>,
      }
      if (ui.searchQuery) {
        body.where = {
          archived: true,
          title: {
            search: ui.searchQuery.split(" ").join(" & "),
          },
          url: {
            search: ui.searchQuery.split(" ").join(" & "),
          },
          desc: {
            search: ui.searchQuery.split(" ").join(" & "),
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
        bookmarkStore.add(searchResults.data as any[])
      }

      if (bookmarkStore.bookmarks.length >= searchResults.count) {
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
    if (e.target instanceof HTMLInputElement) {
      return
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "j" || e.key === "k") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = bookmarkStore.bookmarks.findIndex(
        (item) => item.id === currentActiveElement.dataset.id,
      )
      const nextIndex =
        e.key === "ArrowDown" || e.key === "j"
          ? currentActiveElementIndex + 1
          : currentActiveElementIndex - 1
      const nextElement = document.querySelector(
        `[data-id="${bookmarkStore.bookmarks[nextIndex]?.id}"]`,
      ) as HTMLElement

      if (nextElement) {
        nextElement.focus()
      }
    }
    if (e.key === "o") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = bookmarkStore.bookmarks.findIndex(
        (item) => item.id === currentActiveElement.dataset.id,
      )
      const targetLink = bookmarkStore.bookmarks[currentActiveElementIndex]?.url
      if (!targetLink) {
        toast.error("No item selected")
        return
      }
      window.open(targetLink, "_target")
    }
  }

  // Handle search input changes
  // Reset and execute first search for new query
  // watch.pre(
  //   () => ui.searchQuery,
  //   () => {
  //     loaderState.reset()
  //     pageNumber = -1
  //     allItems = []
  //     loadMore()
  //   },
  // )

  // Reset state on unmount
  onDestroy(() => {
    if (ui.searchQuery) {
      ui.searchQuery = ""
    }
  })
</script>

<svelte:head>
  <title>BriefButler | Archives</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<Navbar />
<main class="align-start outline-none overflow-y-scroll flex flex-col justify-start gap-2">
  {#if bookmarkStore.bookmarks?.length}
    <div class="h-full">
      <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
        {#each bookmarkStore.bookmarks as item (item.id)}
          <BookmarkRow bookmark={item} />
        {/each}
        {#snippet noData()}
          {#if bookmarkStore.bookmarks.length >= 10}
            <div class="text-2xl">No more data</div>
          {/if}
        {/snippet}
      </InfiniteLoader>
    </div>
  {:else}
    <EmptyState showArrow={false} />
    <div class="w-full text-center text-muted-foreground">
      Try archiving a <a class="underline underline-offset-4" href="/bookmarks">bookmark</a>
    </div>
  {/if}
</main>
