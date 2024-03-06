<script lang="ts">
  import toast from "svelte-french-toast"
  // import { toast } from "svelte-sonner"

  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { InfiniteLoader, loaderState } from "svelte-infinite"
  import { Logger, loggerLevels } from "$lib/utils/logger"
  import { untrack } from "svelte"

  const ui = useInterface()
  const { data } = $props()

  let pageNumber = $state(1)
  let allItems = $state<LoadBookmarkFlatTags[]>(data.bookmarks.data!)
  let rootElement = $state<HTMLElement>()

  const logger = new Logger({ level: loggerLevels.DEBUG })

  $effect(() => {
    allItems = data.bookmarks.data!
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
        where: {},
      }
      if (ui.searchQuery) {
        body.where = {
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

  // Handle search input changes
  // Reset and execute first search for new query
  $effect.pre(() => {
    if (ui.searchQuery) {
      untrack(() => {
        loaderState.reset()
        pageNumber = 0
        allItems = []
        loadMore()
      })
    }
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
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<Navbar />
<main
  class="align-start overflow-y-scroll flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2"
  bind:this={rootElement}
>
  {#if data.bookmarks?.count}
    <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
      {#each allItems as item, i (item.id)}
        <BookmarkRow bind:bookmark={allItems[i]} />
      {/each}
    </InfiniteLoader>
  {:else}
    <EmptyState />
    <p class="mx-auto w-1/2 text-center text-muted-foreground">
      Get started by adding a bookmark with the
      <svg
        class="inline p-1 rounded-md size-7 dark:bg-zinc-700"
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
</main>
