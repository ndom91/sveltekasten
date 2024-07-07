<script lang="ts">
  import { toast } from "svelte-sonner"
  import { ofetch } from "ofetch"
  import { InfiniteLoader, loaderState } from "svelte-infinite"
  import { getContext, onDestroy, onMount } from "svelte"
  import { watch } from "runed"
  import FilterBar from "./FilterBar.svelte"
  import { page } from "$app/stores"

  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import { useInterface } from "$state/ui.svelte"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import { Logger, loggerLevels } from "$lib/utils/logger"
  import { goto } from "$app/navigation"

  const ui = useInterface()
  const bookmarkStore = getContext<BookmarkContext>("bookmarks")
  bookmarkStore.bookmarks = $page.data.bookmarks.data

  onMount(() => {
    // Share Target Redirect
    const showQuickAdd = $page.url.searchParams.get("quickAdd")
    if (showQuickAdd === "true") {
      goto("/bookmarks")
      ui.toggleQuickAdd()
    }
  })

  let pageNumber = $state(0)
  let rootElement = $state<HTMLElement>()

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
        // allItems.push(...(searchResults.data as any[]))
        bookmarkStore.add(searchResults.data)
      }

      // if (allItems.length >= searchResults.count) {
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

  // Handle search input changes
  // Reset and execute first search for new query
  watch.pre(
    () => ui.searchQuery,
    () => {
      loaderState.reset()
      pageNumber = -1
      bookmarkStore.bookmarks = []
      loadMore()
    },
  )

  // Handle keyboard navigation of items
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) {
      return
    }
    // Navigate up / down list of items
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

    // Open item in same tab
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
  class="align-start overflow-y-scroll flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2"
  bind:this={rootElement}
>
  <FilterBar />
  {#if bookmarkStore.bookmarks?.length}
    <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
      {#each bookmarkStore.bookmarks as item (item.id)}
        <BookmarkRow bind:bookmarkId={item.id} />
      {/each}
      {#snippet noData()}
        {#if bookmarkStore.bookmarks.length >= 10}
          <div class="text-2xl">No more data</div>
        {/if}
      {/snippet}
    </InfiniteLoader>
  {:else}
    <EmptyState />
    <ul
      class="p-12 mx-auto mt-6 space-y-8 w-full list-none text-left md:p-8 md:px-0 md:w-1/2 text-muted-foreground"
    >
      <li class="relative">
        <span
          class="absolute -left-5 -top-8 text-6xl font-bold -z-10 text-neutral-500/10 dark:text-neutral-900/40"
        >
          1
        </span>
        Open the quick add form with the add button (
        <svg
          class="inline p-1 rounded-md size-7 bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-100"
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
          class="absolute -left-6 -top-8 text-6xl font-bold -z-10 text-neutral-500/10 dark:text-neutral-900/40"
        >
          2
        </span>
        Drag-and-drop a URL onto the page.
      </li>
      <li class="relative">
        <span
          class="absolute -left-6 -top-8 text-6xl font-bold -z-10 text-neutral-500/10 dark:text-neutral-900/40"
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
