<script lang="ts">
  import { page } from "$app/stores"
  import { ofetch } from "ofetch"
  import { cn } from "$lib/utils/style"
  import { format } from "@formkit/tempo"
  import { Badge } from "$lib/components/ui/badge"
  import dompurify from "isomorphic-dompurify"
  import FeedActions from "./FeedActions.svelte"
  import { useInterface } from "$state/ui.svelte"
  import type { Feed, FeedEntry, FeedEntryMedia } from "$lib/types/zod"

  const ui = useInterface()

  let {
    feedEntry,
    handleGenerateSpeech,
    handleSummarizeText,
  }: {
    feedEntry: FeedEntry & {
      feedMedia: FeedEntryMedia[]
      feed: Feed
    }
    handleGenerateSpeech: (text: string) => void
    handleSummarizeText: (text: string) => void
  } = $props()

  let isOptionsOpen = $state(false)
  let card = $state<HTMLElement>()
  let cardOpen = $state(false)
  let feedBodyElement = $state<HTMLElement>()!

  const openButtonGroup = () => {
    isOptionsOpen = true
  }

  const closeButtonGroup = () => {
    isOptionsOpen = false
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) return
    if (e.key === "\\" && e.target === card) {
      e.preventDefault()
      handleToggleCardOpen()
    }
    if (e.key === "u" && e.target === card) {
      e.preventDefault()
      handleMarkAsUnread()
    }
  }

  const handleToggleCardOpen = () => {
    cardOpen = !cardOpen

    if (feedEntry.unread === true) {
      handleMarkAsUnread(false)
    }
  }

  const handleSetTextToSpeechContent = async () => {
    ui.textToSpeechAudioBlob = ""
    // Hack to quickly get text content from HTML String
    let tmp = document.createElement("div")
    tmp.innerHTML = feedEntry.content!
    handleGenerateSpeech(tmp.textContent!)
  }

  const handleStartTextSummarization = () => {
    handleSummarizeText(feedEntry.content ?? "")
  }

  const handleMarkAsUnread = async (target: boolean | null = null) => {
    feedEntry = {
      ...feedEntry,
      unread: target ?? !feedEntry.unread,
    }
    await ofetch(`/api/v1/feeds`, {
      method: "PUT",
      body: { feedEntry },
    })
  }

  const mutate = () => {
    if (cardOpen) {
      feedBodyElement.style.opacity = "1.0"
      // feedBodyElement.style.minHeight = "fit-content"
      // feedBodyElement.style.display = "block"
      feedBodyElement.style.height = "fit-content"
      feedBodyElement.style.transform = "scaleY(100%)"
    } else {
      feedBodyElement.style.opacity = "0"
      // feedBodyElement.style.minHeight = "0px"
      // feedBodyElement.style.display = "none"
      feedBodyElement.style.height = "0px"
      feedBodyElement.style.transform = "scaleY(0)"
    }
  }

  $effect(() => {
    // Hack to get effect to run on cardOpen change
    cardOpen
    document.startViewTransition ? document.startViewTransition(() => mutate()) : mutate()
  })

  const isFeedVisible = $derived(
    !!$page.data.feeds.data.find((feed: Feed) => feed.id === feedEntry.feed.id).visible,
  )
  const hideUnread = $derived.by(() => {
    if (ui.showUnreadOnly) {
      return !feedEntry.unread
    }
    return false
  })
</script>

<svelte:window onkeydown={handleKeyDown} />

<div
  data-id={feedEntry.id}
  role="row"
  bind:this={card}
  tabindex="0"
  class={cn(
    "grid relative gap-4 p-4 mx-4 rounded-lg rounded-l-none border-l-4 border-transparent transition-all duration-300 outline-none focus:outline-none grid-cols-[10rem_1fr] dark:focus:bg-zinc-900 focus:border-zinc-500 focus:bg-zinc-100",
    !isFeedVisible && "hidden",
    hideUnread && "hidden",
  )}
  on:mouseleave={closeButtonGroup}
  on:mouseenter={openButtonGroup}
>
  {#if feedEntry.unread}
    <div class="absolute top-2 left-2 bg-emerald-400 rounded-full duration-1000 size-4" />
  {/if}
  <img
    src={feedEntry.feedMedia?.[0]?.href ??
      `https://picsum.photos/seed/${encodeURIComponent(
        feedEntry.title.replaceAll(" ", "").substring(0, 5).toLowerCase(),
      )}/240/153.webp`}
    alt="Feed Item Hero"
    class="object-cover object-center w-48 h-24 rounded-md border border-neutral-100 dark:border-neutral-800"
  />
  <div class="flex flex-col justify-between">
    <span class="w-auto text-xl font-bold line-clamp-1 min-h-[28px]" title={feedEntry.title}>
      {feedEntry.title}
    </span>
    <div
      bind:this={feedBodyElement}
      class={cn(
        "prose max-w-screen-lg origin-top prose-img:!w-full dark:prose-blockquote:text-zinc-200 prose-img:!h-auto prose-img:max-w-screen-md prose-img:object-contain prose-video:aspect-video prose-video:max-w-screen-sm dark:text-zinc-100 dark:prose-headings:text-zinc-100 dark:prose-a:text-zinc-200 dark:prose-strong:text-zinc-100 transition-all h-0 opacity-0",
        cardOpen ? "h-fit" : "h-0",
      )}
    >
      {@html dompurify.sanitize(feedEntry.content ?? "")}
    </div>
    <div class="flex gap-2 justify-start items-center mt-2 text-sm text-muted">
      {#if feedEntry.link}
        <img
          src={`https://icons.duckduckgo.com/ip9/${new URL(feedEntry.link).hostname}.ico`}
          alt="URL Favicon"
          class="rounded-full size-4"
        />
        <a target="_blank" href={feedEntry.link} class="line-clamp-1 text-clip text-zinc-500">
          {feedEntry.link}
        </a>
      {/if}
    </div>
    <span class="flex flex-wrap gap-2 mt-3">
      <Badge variant="secondary">
        {format(feedEntry.createdAt, { date: "medium", time: "short" })}
      </Badge>
      {#if feedEntry.categories}
        {#each feedEntry.categories as category}
          <Badge variant="outline">
            {category}
          </Badge>
        {/each}
      {/if}
    </span>
  </div>
  <FeedActions
    url={feedEntry.link ?? ""}
    {isOptionsOpen}
    {handleToggleCardOpen}
    {handleMarkAsUnread}
    {handleSetTextToSpeechContent}
    {handleStartTextSummarization}
  />
</div>
