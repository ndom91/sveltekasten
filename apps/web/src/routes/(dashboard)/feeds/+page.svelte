<script lang="ts">
  import { onDestroy, untrack } from "svelte"
  import toast from "svelte-french-toast"
  import { ofetch } from "ofetch"
  import { InfiniteLoader, loaderState } from "svelte-infinite"
  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { FeedRow } from "$lib/components/feed-row"
  import Blob from "$lib/assets/blob1.png"
  import FilterBar from "./FilterBar.svelte"
  import { registerTtsWorker, handleGenerateSpeech } from "./tts.svelte.ts"
  import { registerSummarizationWorker, handleSummarizeText } from "./summarization.svelte.ts"

  import { useInterface } from "$state/ui.svelte"
  import { invalidateAll } from "$app/navigation"
  import { documentVisibilityStore } from "$lib/utils/documentVisibility"

  const ui = useInterface()
  const { data } = $props()

  // Log error from page server loading
  if (data.error) {
    console.error(data.error)
  }

  let pageNumber = $state(0)
  let allItems = $state<LoadFeedEntry[]>(data.feedEntries?.data as LoadFeedEntry[])
  let rootElement = $state<HTMLElement>()
  const limitLoadCount = 20

  // Reset feed items on load invalidation
  $effect(() => {
    allItems = data.feedEntries?.data as LoadFeedEntry[]
  })

  registerTtsWorker()
  registerSummarizationWorker()

  // Reload feed when coming back to tab
  const visibility = documentVisibilityStore()
  let prevVisibility: DocumentVisibilityState = "visible"

  // Page visibility auto refresh
  $effect(() => {
    if (prevVisibility === "hidden" && $visibility === "visible") {
      invalidateAll()
      pageNumber = 1
    }
    prevVisibility = $visibility
  })

  const fetchSearchResults = async ({
    limit = limitLoadCount,
    skip = 0,
  }: {
    limit?: number
    skip?: number
  }) => {
    try {
      const body = {
        type: "feedEntry",
        skip,
        limit,
        include: {
          feed: true,
          feedMedia: true,
        },
        orderBy: { published: "desc" },
        where: {},
      }
      if (ui.searchQuery) {
        body.where = {
          title: {
            search: ui.searchQuery,
          },
          contentSnippet: {
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

      // console.log("loadMore.shuoldSkip?", { allItems: allItems.length, skip })
      // If there are less results than the first page, we are done
      // if (allItems.length !== 0 && allItems.length < skip) {
      //   loaderState.complete()
      //   return
      // }

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

  // Handle search input changes
  // Reset fields and load first results from api
  $effect.pre(() => {
    // eslint-disable-next-line no-unused-expressions
    ui.searchQuery
    console.log("effect.query changed")
    // TODO: allow resetting search
    untrack(() => {
      console.log("effect.loaderState.reset")
      loaderState.reset()
      pageNumber = -1
      allItems = []
      loadMore()
    })
  })

  // Handle keyboard navigation of items
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) {
      return
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "j" || e.key === "k") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = allItems.findIndex(
        (item: LoadFeedEntry) => item.id === currentActiveElement.dataset.id,
      )
      const nextIndex =
        e.key === "ArrowDown" || e.key === "j"
          ? currentActiveElementIndex + 1
          : currentActiveElementIndex - 1
      const nextElement = document.querySelector(
        `[data-id="${allItems[nextIndex]?.id}"]`,
      ) as HTMLDivElement

      if (nextElement) {
        nextElement.focus()
      }
    }
    if (e.key === "o") {
      e.preventDefault()
      const currentActiveElement = e.target as HTMLElement
      const currentActiveElementIndex = allItems.findIndex(
        (item: LoadFeedEntry) => item.id === currentActiveElement.dataset.id,
      )
      const targetLink = allItems[currentActiveElementIndex]?.link
      if (!targetLink) {
        toast.error("No item selected", { icon: "🚫" })
        return
      }
      window.open(targetLink, "_target")
    }
  }

  // Reset state on unmount
  onDestroy(() => {
    if (ui.textToSpeechAudioBlob) {
      ui.textToSpeechAudioBlob = ""
    }

    if (ui.searchQuery) {
      ui.searchQuery = ""
    }
  })
</script>

<svelte:head>
  <title>Briefkasten | Feeds</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<Navbar />
<main
  class="align-start overflow-y-scroll flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2"
  bind:this={rootElement}
>
  <FilterBar />
  {#if data.feedEntries?.count}
    <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
      {#each allItems as feedEntry (feedEntry.id)}
        <FeedRow {feedEntry} {handleSummarizeText} {handleGenerateSpeech} />
      {/each}
    </InfiniteLoader>
  {:else}
    <EmptyState showArrow={false}>
      {#snippet illustration()}
        <img src={Blob} alt="Empty State Blob" class="m-16 w-full max-w-md grayscale dark:invert" />
      {/snippet}
    </EmptyState>
    <p class="mx-auto w-1/2 text-center text-muted-foreground">
      Get started by adding a feed in the
      <a class="underline underline-offset-2" href="/settings"> settings </a>
    </p>
  {/if}
</main>
