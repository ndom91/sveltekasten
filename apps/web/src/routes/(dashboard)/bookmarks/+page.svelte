<script lang="ts">
  import { watch } from "runed"
  import { onDestroy, onMount } from "svelte"
  import { InfiniteLoader, loaderState } from "svelte-infinite"
  import { toast } from "svelte-sonner"
  import FilterBar from "./FilterBar.svelte"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { Navbar } from "$lib/components/navbar"
  import { BookmarksService } from "$lib/state/bookmarks.svelte"
  import { useInterface } from "$lib/state/ui.svelte"
  import { getContext } from "$lib/utils/context"
  import { Logger, loggerLevels } from "$lib/utils/logger"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  const ui = useInterface()
  const bookmarkService = getContext(BookmarksService)

  onMount(async () => {
    const showQuickAdd = $page.url.searchParams.get("quickAdd")
    if (showQuickAdd === "true") {
      await goto("/bookmarks")
      ui.toggleQuickAdd()
    }
  })

  let pageNumber = $state(0)
  let rootElement = $state<HTMLElement>()

  const limitLoadCount = 20
  const logger = new Logger({ level: loggerLevels.DEBUG })

  // $effect(() => {
  //   if ($page.data.bookmarks.data.length) {
  //     $page.data.bookmarks.data.forEach((bk: LoadBookmarkFlatTags) => {
  //       bookmarkService.update(bk)
  //     })
  //   }
  // })

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
          archived: false,
        },
      }
      if (ui.searchQuery) {
        body.where = {
          archived: false,
          title: {
            search: ui.searchQuery.split(" ").join(" & "),
          },
          url: {
            search: ui.searchQuery.split(" ").join(" & "),
          },
          desc: {
            search: ui.searchQuery.split(" ").join(" & "),
          },
        } as { archived: boolean } & Record<string, any>
      }
      const searchResponse = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const { data, count } = await searchResponse.json()
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
        bookmarkService.append(searchResults.data)
      }

      if (bookmarkService.bookmarks.length >= searchResults.count) {
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

  // Handle search input changes
  // Reset and execute first search for new query
  watch.pre(
    () => ui.searchQuery,
    () => {
      loaderState.reset()
      pageNumber = -1
      // bookmarkStore.bookmarks = []
      loadMore()
    },
  )

  // Handle keyboard navigation of items
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) {
      return
    }

    // Navigate up / down list of items
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "j" || e.key === "k") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = bookmarkService.bookmarks.findIndex(
        (item) => item.id === currentActiveElement.dataset.id,
      )

      const nextIndex =
        e.key === "ArrowDown" || e.key === "j"
          ? currentActiveElementIndex + 1
          : currentActiveElementIndex - 1

      const nextElement = document.querySelector(
        `[data-id="${bookmarkService.bookmarks[nextIndex]?.id}"]`,
      ) as HTMLElement

      if (nextElement) {
        nextElement.focus()
      }
    }

    // Open item in same tab
    if (e.key === "o") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = bookmarkService.bookmarks.findIndex(
        (item) => item.id === currentActiveElement.dataset.id,
      )
      const targetLink = bookmarkService.bookmarks[currentActiveElementIndex]?.url
      if (!targetLink) {
        toast.error("No item selected")
        return
      }
      window.open(targetLink, "_target")
    }
  }

  // Reset state on unmount
  onDestroy(() => {
    if (ui.searchQuery) {
      ui.searchQuery = ""
    }
  })
</script>

<svelte:head>
  <title>BriefButler | Bookmarks</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<Navbar />
<main
  class="align-start flex flex-col justify-start gap-2 overflow-y-scroll outline-none"
  bind:this={rootElement}
>
  <FilterBar />
  {#if bookmarkService.bookmarks?.length}
    <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
      {#each bookmarkService.bookmarks as item (item.id)}
        <BookmarkRow bookmark={item} />
      {/each}
      {#snippet noData()}
        {#if bookmarkService.bookmarks.length >= 10}
          <div class="text-2xl">No more data</div>
        {/if}
      {/snippet}
    </InfiniteLoader>
  {:else}
    <EmptyState />
    <ul
      class="text-muted-foreground mx-auto mt-6 w-full list-none space-y-8 p-12 text-left md:w-1/2 md:p-8 md:px-0"
    >
      <li class="relative">
        <span
          class="absolute -left-5 -top-8 -z-10 text-6xl font-bold text-neutral-500/10 dark:text-neutral-700/30"
        >
          1
        </span>
        Open the quick add form with the add button (
        <svg
          class="size-7 inline rounded-md bg-neutral-300 p-1 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-100"
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
        ) above <i>or</i> by using the keyboard shortcut, <KeyboardIndicator
          class="text-sm"
          key="Alt N"
        />.
      </li>
      <li class="relative">
        <span
          class="absolute -left-6 -top-8 -z-10 text-6xl font-bold text-neutral-500/10 dark:text-neutral-700/30"
        >
          2
        </span>
        Drag-and-drop a URL onto the page.
      </li>
      <li class="relative">
        <span
          class="absolute -left-6 -top-8 -z-10 text-6xl font-bold text-neutral-500/10 dark:text-neutral-700/30"
        >
          3
        </span>
        With a URL in your clipboard, paste onto the page with <KeyboardIndicator
          class="text-sm"
          key="Ctrl V"
        />.
      </li>
    </ul>
  {/if}
</main>
