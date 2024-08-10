<script lang="ts">
  import { format } from "@formkit/tempo"
  import dompurify from "isomorphic-dompurify"
  import { ofetch } from "ofetch"
  import { watch } from "runed"
  import FeedActions from "./FeedActions.svelte"
  import MobileFeedActions from "./MobileFeedActions.svelte"
  import MediaQuery from "$lib/components/MediaQuery.svelte"
  import { Badge } from "$lib/components/ui/badge"
  import { cn } from "$lib/utils/style"
  import { useInterface } from "$state/ui.svelte"
  import type { Feed, FeedEntry, FeedEntryMedia } from "$lib/types/zod"
  import { page } from "$app/stores"
  import { env } from "$env/dynamic/public"

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
    handleGenerateSpeech: (text: string) => Promise<void>
    handleSummarizeText: (text: string) => void
  } = $props()

  let showFeedActions = $state(false)
  let card = $state<HTMLElement>()
  let cardOpen = $state(false)
  let feedBodyElement = $state<HTMLElement>()!

  const imageUrl = $derived.by(() => {
    if (feedEntry.feedMedia?.[0]?.href) {
      return `${env.PUBLIC_IMG_URL}/s_160x96/${feedEntry.feedMedia?.[0]?.href}`
    } else {
      return `${env.PUBLIC_IMG_URL}/https://picsum.photos/seed/${encodeURIComponent(feedEntry.id)}/240/153.webp`
    }
  })

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

  const handleToggleCardOpen = async () => {
    cardOpen = !cardOpen

    if (feedEntry.unread === true) {
      await handleMarkAsUnread(false)
    }
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) {
      return
    }
    if (e.key === "\\" && e.target === card) {
      e.preventDefault()
      await handleToggleCardOpen()
    }
    if (e.key === "u" && e.target === card) {
      e.preventDefault()
      await handleMarkAsUnread()
    }
  }

  const handleSetTextToSpeechContent = async () => {
    ui.textToSpeechAudioBlob = ""
    // Hack to quickly get text content from HTML String
    const tmp = document.createElement("div")
    tmp.innerHTML = feedEntry.content!
    await handleGenerateSpeech(tmp.textContent!)
  }

  const handleStartTextSummarization = () => {
    handleSummarizeText(feedEntry.content ?? "")
  }

  const mutate = () => {
    return new Promise<void>((resolve) => {
      if (cardOpen) {
        feedBodyElement.style.opacity = "1.0"
        feedBodyElement.style.height = "fit-content"
        feedBodyElement.style.transform = "scaleY(100%)"
      } else {
        feedBodyElement.style.opacity = "0"
        feedBodyElement.style.height = "0px"
        feedBodyElement.style.transform = "scaleY(0)"
      }
      resolve()
    })
  }

  watch.pre(
    () => cardOpen,
    () => {
      void (document.startViewTransition ? document.startViewTransition(() => mutate()) : mutate())
    },
  )

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
    "grid relative gap-4 mx-2 p-4 md:mx-4 rounded-lg rounded-l-none border-l-4 border-transparent transition-all duration-300 outline-none focus:outline-none grid-cols-1 md:grid-cols-[10rem_1fr] dark:focus:bg-neutral-800/40 focus:border-neutral-500 focus:bg-neutral-100",
    !isFeedVisible && "hidden",
    hideUnread && "hidden",
  )}
  onpointerleave={() => (showFeedActions = false)}
  onpointerenter={() => (showFeedActions = true)}
>
  <div
    class={cn(
      "absolute transition-[var(--ease-in-out-3)] top-2 left-2 bg-emerald-400 rounded-full size-4",
      feedEntry.unread ? "opacity-100" : "opacity-0",
    )}
  ></div>
  <img
    src={imageUrl}
    alt="Feed Item Hero"
    class="hidden h-24 w-48 rounded-md border border-neutral-100 object-cover object-center dark:border-neutral-800 md:block"
  />
  <div class="flex w-full flex-col justify-between pr-6 md:pr-0">
    <span
      class="line-clamp-2 min-h-[28px] w-auto pr-4 text-xl font-semibold md:line-clamp-1 md:pr-0"
      title={feedEntry.title}
    >
      {feedEntry.title}
    </span>
    <div
      bind:this={feedBodyElement}
      class={cn(
        "prose max-w-screen-lg origin-top prose-img:!w-full dark:prose-blockquote:text-neutral-200 prose-img:!h-auto prose-img:max-w-screen-md prose-img:object-contain prose-video:aspect-video prose-video:max-w-screen-sm dark:text-neutral-100 dark:prose-headings:text-neutral-100 dark:prose-a:text-neutral-200 dark:prose-strong:text-neutral-100 transition-all h-0 opacity-0",
        cardOpen ? "h-fit" : "h-0",
      )}
    >
      <!-- eslint-disable-next-line -->
      {@html dompurify.sanitize(feedEntry.content ?? "", {
        USE_PROFILES: { html: true },
        ALLOW_DATA_ATTR: false,
        KEEP_CONTENT: false,
        ALLOW_ARIA_ATTR: false,
        FORBID_ATTR: ["style"],
        FORBID_TAGS: ["style"],
      })}
    </div>
    <div class="text-muted mt-2 flex items-center justify-start gap-2 text-sm">
      {#if feedEntry.link}
        <img
          src={`https://favicon.yandex.net/favicon/${new URL(feedEntry.link).hostname}`}
          alt="URL Favicon"
          class="size-4 rounded-full"
        />
        <a
          target="_blank"
          href={feedEntry.link}
          onclick={() => handleMarkAsUnread()}
          class="line-clamp-1 text-clip text-neutral-500"
        >
          {feedEntry.link}
        </a>
      {/if}
    </div>
    <span class="mt-3 flex flex-wrap gap-2">
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
  <MediaQuery query="(max-width: 767px)">
    {#snippet children(matches)}
      {#if matches}
        <MobileFeedActions
          url={feedEntry.link ?? ""}
          {handleToggleCardOpen}
          {handleMarkAsUnread}
          {handleSetTextToSpeechContent}
          {handleStartTextSummarization}
        />
      {:else}
        <FeedActions
          url={feedEntry.link ?? ""}
          isOptionsOpen={showFeedActions}
          {handleToggleCardOpen}
          {handleMarkAsUnread}
          {handleSetTextToSpeechContent}
          {handleStartTextSummarization}
        />
      {/if}
    {/snippet}
  </MediaQuery>
</div>
