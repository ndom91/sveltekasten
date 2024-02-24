<script lang="ts">
  import { cn } from "$lib/utils/style"
  import { format } from "@formkit/tempo"
  import { Badge } from "$lib/components/ui/badge"
  import type { FeedEntry, FeedEntryMedia } from "$zod"
  import dompurify from "dompurify"
  import { tweened } from "svelte/motion"
  import { quintOut } from "svelte/easing"
  import { useInterface } from "$state/ui.svelte"
  import { tick } from "svelte"

  const ui = useInterface()

  let { feedEntry, handleGenerateSpeech, handleSummarizeText } = $props<{
    feedEntry: FeedEntry & {
      feedMedia: FeedEntryMedia[]
    }
    handleGenerateSpeech: (text: string) => void
    handleSummarizeText: (text: string) => void
  }>()

  let isOptionsOpen = $state(false)
  let card = $state<HTMLElement>()
  let cardOpen = $state(false)

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
    // Only toggle and make network request if necessary
    if (feedEntry.unread === true) {
      handleMarkAsUnread(false)
    }
  }

  const handleSetTextToSpeechContent = async () => {
    ui.textToSpeechAudioBlob = ""
    // Hack to quickly get text content from HTML String
    let tmp = document.createElement("div")
    tmp.innerHTML = feedEntry.content!
    handleGenerateSpeech(tmp.textContent)
  }

  const handleStartTextSummarization = () => {
    handleSummarizeText(feedEntry.content ?? "")
  }

  const handleMarkAsUnread = async (target: boolean | null = null) => {
    feedEntry = {
      ...feedEntry,
      unread: target ?? !feedEntry.unread,
    }
    await fetch(`/api/v1/feeds`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedEntry }),
    })
  }

  // const size = spring(0)
  // size.stiffness = 0.3
  // size.damping = 0.4
  // size.precision = 0.005
  const size = tweened(0, {
    duration: 700,
    delay: 200,
    easing: quintOut,
  })

  $effect(() => {
    if (cardOpen) {
      size.set(100)
    } else {
      size.set(0)
    }
  })
</script>

<svelte:window on:keydown={handleKeyDown} />

<div
  data-id={feedEntry.id}
  role="row"
  bind:this={card}
  tabindex="0"
  class="grid relative gap-4 p-4 mx-4 rounded-lg rounded-l-none border-l-4 border-transparent transition-all duration-300 outline-none focus:outline-none grid-cols-[10rem_1fr] dark:focus:bg-zinc-900 focus:border-zinc-500 focus:bg-zinc-100"
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
    <span class="w-auto text-xl font-bold line-clamp-1 min-h-[28px]">
      {feedEntry.title}
    </span>
    <div
      style="transform: scaleY({$size === 0 ? '0' : `${$size}%`})"
      class={cn(
        "prose max-w-screen-lg origin-top prose-img:!w-full dark:prose-blockquote:text-zinc-200 prose-img:!h-auto prose-img:max-w-screen-md prose-img:object-contain prose-video:aspect-video prose-video:max-w-screen-sm dark:text-zinc-100 dark:prose-headings:text-zinc-100 dark:prose-a:text-zinc-200 dark:prose-strong:text-zinc-100",
        cardOpen ? "h-full" : "h-0 pointer-events-none opacity-0",
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
        <a target="_blank" href={feedEntry.link} class="line-clamp-1 text-clip">
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
  {#await import("./FeedActions.svelte") then { default: Actions }}
    <svelte:component
      this={Actions}
      url={feedEntry.link ?? ""}
      {isOptionsOpen}
      {handleToggleCardOpen}
      {handleMarkAsUnread}
      {handleSetTextToSpeechContent}
      {handleStartTextSummarization}
    />
  {/await}
</div>
