<script lang="ts">
  import toast from "svelte-french-toast"
  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { FeedRow } from "$lib/components/feed-row"
  import { Skeleton } from "$lib/components/ui/skeleton"

  import { useInterface, TTSLocation } from "$state/ui.svelte"
  import { infiniteScroll } from "$lib/components/infinite-scroll"
  import { invalidateAll } from "$app/navigation"
  import { documentVisibilityStore } from "$lib/utils/documentVisibility"
  import ttsWorkerUrl from "$lib/transformers/tts-worker?url"
  import summaryWorkerUrl from "$lib/transformers/translate-worker?url"

  const ui = useInterface()
  const { data } = $props()
  let pageNumber = $state(1)
  let totalItemCount = $state<number>(data.feedEntries?.count)
  let allItems = $state<LoadFeedEntry>(data.feedEntries?.data)

  // Reload feed when coming back to tab
  const visibility = documentVisibilityStore()
  let prevVisibility: DocumentVisibilityState = "visible"

  // TTS Model
  let progressItems = $state<TODO>([])
  let disabledTtsButton = $state(false)
  let ttsWorker = $state<Worker>()

  $effect(() => {
    if (
      !ui.aiFeaturesPreferences.tts ||
      ui.aiFeaturesPreferences.ttsLocation !== TTSLocation.BROWSER
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

  const handleGenerateSpeech = async (text: string, id?: string) => {
    if (!ui.aiFeaturesPreferences.tts) return
    if (ui.aiFeaturesPreferences.ttsLocation === TTSLocation.SERVER) {
      const ttsResponse = await fetch("/api/v1/tts", {
        method: "POST",
        body: JSON.stringify({
          speaker,
          text,
        }),
      })
      const blobData = await ttsResponse.blob()
      const blobUrl = URL.createObjectURL(blobData)
      ui.textToSpeechAudioBlob = blobUrl
      return
    }

    if (
      !ttsWorker ||
      !ui.aiFeaturesPreferences.tts ||
      ui.aiFeaturesPreferences.ttsLocation !== TTSLocation.BROWSER
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
    if (!summaryWorker && ui.aiFeaturesPreferences.summarization) {
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
    if (!summaryWorker || !ui.aiFeaturesPreferences.summarization) return
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

  // Log error from page server loading
  if (data.error) {
    console.error(data.error)
  }

  // Infinite scrolling
  let elementRef = $state<HTMLElement>()
  let listWrapperEl = $state<HTMLElement>()
  let observer: IntersectionObserver | null = $state(null)

  $effect(() => {
    if (elementRef) {
      observer = infiniteScroll({
        fetch: () => loadMore(pageNumber + 1),
        element: elementRef,
      })
      return () => observer?.disconnect()
    }
  })

  // Load more items on infinite scroll
  const loadMore = async (p: number) => {
    pageNumber = p
    const loadCount = 20
    const limit = loadCount
    const skip = loadCount * (pageNumber - 1)

    if (
      // Skip if all items already loaded
      allItems.length >= totalItemCount ||
      // Skip if list is less than window to avoid loop
      (listWrapperEl && listWrapperEl.scrollHeight < window.innerHeight)
    )
      return

    const res = await fetch(`/api/v1/feeds?skip=${skip}&limit=${limit}`)
    const { data: additionalResults } = await res.json()
    allItems.push(...additionalResults)
  }

  // Handle search input
  let getActiveFeedItems = $derived(async () => {
    if (!ui.searchQuery)
      return allItems
        .filter((item: LoadFeedEntry) => {
          if (ui.showUnreadOnly) {
            return !!item.unread
          } else {
            return item
          }
        })
        .filter((item: LoadFeedEntry) => {
          const feed = data.feeds?.data?.find((feed) => feed.id === item.feed?.id)
          return feed?.visible
        })

    const res = await fetch("/api/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "feedEntry",
        include: {
          feed: true,
          feedMedia: true,
        },
        orderBy: { published: "desc" },
        where: {
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
        },
      }),
    })
    const { data: searchResults, count } = await res.json()
    totalItemCount = count
    return searchResults
  })

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
</script>

<svelte:head>
  <title>Briefkasten | Feeds</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<Navbar />
<div class="flex overflow-y-scroll flex-col">
  <main class="h-full">
    <div class="align-start flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start">
      {#if data.feedEntries?.count > 0}
        <div bind:this={listWrapperEl} class="overflow-y-scroll h-full">
          {#await getActiveFeedItems()}
            {#each Array.from({ length: 10 }) as _}
              <div class="h-40 text-3xl">
                <div class="flex gap-4 items-start p-4 mx-4 w-full opacity-10">
                  <Skeleton class="w-52 h-28 rounded-md" />
                  <div class="flex flex-col gap-4 items-start w-full">
                    <Skeleton class="w-3/4 h-4 min-w-[300px]" />
                    <Skeleton class="w-4/5 h-10 min-w-[400px]" />
                    <Skeleton class="w-96 h-4 min-w-[100px]" />
                  </div>
                </div>
              </div>
            {/each}
          {:then feedEntries}
            {#each feedEntries as feedEntry}
              <FeedRow {feedEntry} {handleSummarizeText} {handleGenerateSpeech} />
            {:else}
              <div class="my-8 w-full text-3xl text-center">No entries found</div>
            {/each}
            <div bind:this={elementRef} class="w-full h-48" />
          {:catch error}
            <div class="my-4 w-full text-3xl text-center">
              {error}
            </div>
          {/await}
        </div>
      {:else}
        <EmptyState />
        <p class="mx-auto w-1/2 text-center text-muted-foreground">
          Get started by adding a feed in <a class="underline" href="/settings">settings</a>
        </p>
      {/if}
    </div>
  </main>
</div>
