<script lang="ts">
  import toast from "svelte-french-toast"
  import { ofetch } from "ofetch"
  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { FeedRow } from "$lib/components/feed-row"
  import { untrack, onDestroy } from "svelte"

  import { useInterface, TTSLocation } from "$state/ui.svelte"
  import { InfiniteLoader, loaderState } from "svelte-infinite"
  import { invalidateAll } from "$app/navigation"
  import { documentVisibilityStore } from "$lib/utils/documentVisibility"
  import ttsWorkerUrl from "$lib/transformers/tts-worker?url"
  import summaryWorkerUrl from "$lib/transformers/translate-worker?url"

  const ui = useInterface()
  const { data } = $props()

  // Log error from page server loading
  if (data.error) {
    console.error(data.error)
  }

  // Reset feed items on load invalidation
  $effect(() => {
    allItems = data.feedEntries?.data
  })

  // Set current user preferences to store
  ui.aiFeaturesPreferences = data.session?.user?.settings.ai!

  let pageNumber = $state(1)
  let allItems = $state<LoadFeedEntry[]>(data.feedEntries?.data)
  let rootElement = $state<HTMLElement>()
  const limitLoadCount = 20

  // Reload feed when coming back to tab
  const visibility = documentVisibilityStore()
  let prevVisibility: DocumentVisibilityState = "visible"

  // TTS Model
  let progressItems = $state<TODO>([])
  let disabledTtsButton = $state(false)
  let ttsWorker = $state<Worker>()

  $effect(() => {
    if (
      !ui.aiFeaturesPreferences.tts.enabled ||
      ui.aiFeaturesPreferences.tts.location !== TTSLocation.BROWSER
    )
      return
    if (!ttsWorker) {
      ttsWorker = new Worker(new URL(ttsWorkerUrl, import.meta.url), {
        type: "module",
      })
    }

    const onMessageReceived = (e: TODO) => {
      switch (e.data.status) {
        case "initiate":
          // Model file start load: add a new progress item to the list.
          progressItems.push(e.data)
          break

        case "progress":
          // Model file progress: update one of the progress items.
          progressItems = progressItems.map((item: TODO) => {
            if (item.file === e.data.file) {
              return { ...item, progress: e.data.progress }
            }
            return item
          })
          break

        case "done":
          // Model file loaded: remove the progress item from the list.
          progressItems = progressItems.filter((item: TODO) => item.file !== e.data.file)
          break

        case "ready":
          console.log("pipeline ready")
          // Pipeline ready: the worker is ready to accept messages.
          // ready = true
          break

        case "complete":
          disabledTtsButton = false

          const blobUrl = URL.createObjectURL(e.data.output)
          console.log(`Audio Set: ${blobUrl}`)
          ui.textToSpeechAudioBlob = blobUrl
          ui.textToSpeechLoading = false
          console.timeEnd("audio.generate")
          break
      }
    }

    ttsWorker?.addEventListener("message", onMessageReceived)

    return () => ttsWorker?.removeEventListener("message", onMessageReceived)
  })

  const handleGenerateSpeech = async (text: string) => {
    if (!ui.aiFeaturesPreferences.tts.enabled) return
    if (ui.aiFeaturesPreferences.tts.location.toUpperCase() === TTSLocation.SERVER) {
      const blobData = await ofetch("/api/v1/tts", {
        method: "POST",
        body: {
          speaker: ui.aiFeaturesPreferences.tts.speaker,
          text,
        },
        responseType: "blob",
      })
      const blobUrl = URL.createObjectURL(blobData)
      ui.textToSpeechAudioBlob = blobUrl
      return
    }

    if (
      !ttsWorker ||
      !ui.aiFeaturesPreferences.tts.enabled ||
      ui.aiFeaturesPreferences.tts.location !== TTSLocation.BROWSER
    )
      return
    console.time("audio.generate")
    disabledTtsButton = true
    ui.textToSpeechLoading = true
    ttsWorker.postMessage({
      text,
    })
  }

  // Summary Worker
  let summaryWorker = $state<Worker>()

  $effect(() => {
    if (!summaryWorker && ui.aiFeaturesPreferences.summarization.enabled) {
      summaryWorker = new Worker(new URL(summaryWorkerUrl, import.meta.url), {
        type: "module",
      })
    }

    const onMessageReceived = (e: TODO) => {
      switch (e.data.status) {
        case "complete":
          disabledTtsButton = false

          ui.summarizationLoading = false
          console.log("Summary:", e.data.output)
          console.timeEnd("summary.generate")
          break
      }
    }

    summaryWorker?.addEventListener("message", onMessageReceived)

    return () => summaryWorker?.removeEventListener("message", onMessageReceived)
  })

  const handleSummarizeText = (text: string) => {
    if (!summaryWorker || !ui.aiFeaturesPreferences.summarization.enabled) return
    console.time("summary.generate")
    disabledTtsButton = true
    ui.summarizationLoading = true
    summaryWorker.postMessage({
      text,
    })
  }

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
          OR: [
            {
              title: {
                contains: `%${ui.searchQuery}%`,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: `%${ui.searchQuery}%`,
                mode: "insensitive",
              },
            },
          ],
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
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
      loaderState.error()
      pageNumber -= 1
    }
  }

  // Handle search input changes
  // Reset fields and load first results from api
  $effect.pre((data) => {
    ui.searchQuery
    untrack(() => {
      loaderState.reset()
      pageNumber = 0
      allItems = []
      loadMore()
    })
  })

  // Handle keyboard navigation of items
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return
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
  {#if data.feedEntries?.count}
    <InfiniteLoader triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
      {#each allItems as feedEntry (feedEntry.id)}
        <FeedRow {feedEntry} {handleSummarizeText} {handleGenerateSpeech} />
      {/each}
    </InfiniteLoader>
  {:else}
    <EmptyState />
    <p class="mx-auto w-1/2 text-center text-muted-foreground">
      Get started by adding a feed in <a class="underline" href="/settings">settings</a>
    </p>
  {/if}
</main>
