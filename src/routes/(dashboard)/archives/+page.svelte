<script lang="ts">
  import toast from "svelte-french-toast"
  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { InfiniteLoader, loaderState } from "svelte-infinite"

  const ui = useInterface()
  const { data } = $props()

  let pageNumber = $state(1)
  let allItems = $state<LoadBookmarkFlatTags[]>(data.bookmarks!)
  let rootElement = $state<HTMLElement>()

  $effect(() => {
    allItems = data.bookmarks!
  })

  const limitLoadCount = 20

  if (data.error) {
    logger.error(String(data.error))
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
        }
      }
      const res = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        throw new Error("Error fetching more items")
      }
      const { data, count } = await res.json()
      return {
        data,
        count,
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
      toast.error(String(error))
    }
  }

  // Load more items on infinite scroll
  const loadMore = async () => {
    try {
      pageNumber += 1
      const limit = limitLoadCount
      const skip = limitLoadCount * (pageNumber - 1)

      // If there are less results than the first page, we are done
      if (allItems.length < skip) {
        loaderState.complete()
        return
      }

      const searchResults = await fetchSearchResults({ limit, skip })
      if (!searchResults?.data) return

      if (searchResults.data.length) {
        allItems.push(...(searchResults.data as any[]))
      }

      if (allItems.length >= searchResults.count) {
        loaderState.complete()
      } else {
        loaderState.loaded()
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
      loaderState.error()
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
  {#if allItems}
    <div class="h-full">
      <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
        {#each allItems as bookmark}
          <BookmarkRow {bookmark} />
        {/each}
      </InfiniteLoader>
    </div>
  {:else}
    <EmptyState showArrow={false} />
    <div class="my-4 w-full text-2xl font-light text-center">
      Try archiving a <a class="underline underline-offset-4" href="/bookmarks">bookmark</a>
    </div>
  {/if}
</main>
