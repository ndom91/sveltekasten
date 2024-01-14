<script lang="ts">
  import { cn } from "$lib/utils"
  // import { page } from "$app/stores"
  import { format } from "date-fns"
  import { Badge } from "$lib/components/ui/badge"
  import type { FeedEntry, FeedEntryMedia } from "$zod"
  import dompurify from "dompurify"

  let { feedEntry } = $props<{
    feedEntry: FeedEntry & {
      feedMedia: FeedEntryMedia[]
    }
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

  const handleMarkAsUnread = async (target: boolean | null = null) => {
    feedEntry = {
      ...feedEntry,
      unread: target ?? !feedEntry.unread,
    }
    await fetch(`/api/feeds`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedEntry }),
    })
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div
  data-id={feedEntry.id}
  role="row"
  bind:this={card}
  tabindex="0"
  class="grid relative gap-4 p-4 mx-4 rounded-lg rounded-l-none border-l-4 border-transparent transition-all duration-300 outline-none focus:outline-none grid-cols-[15rem_1fr] dark:focus:bg-zinc-900 focus:border-zinc-500 focus:bg-zinc-100"
  on:mouseleave={closeButtonGroup}
  on:mouseenter={openButtonGroup}
>
  {#if feedEntry.unread}
    <div class="absolute top-2 left-2 bg-emerald-400 rounded-full duration-1000 size-4" />
  {/if}
  <div>
    <img
      src={feedEntry.feedMedia?.[0]?.href ??
        `https://picsum.photos/seed/${encodeURIComponent(
          feedEntry.title.replaceAll(" ", "").substring(0, 5).toLowerCase(),
        )}/240/153.webp`}
      alt="Feed Item Hero"
      class="object-cover rounded-md"
    />
  </div>
  <div class="flex flex-col">
    <span class="w-auto text-xl font-bold line-clamp-1 min-h-[28px]">
      {feedEntry.title}
    </span>
    <p
      class={cn(
        "prose max-w-screen-lg transition-all duration-300 prose-img:!h-auto prose-img:max-w-screen-md prose-img:object-contain prose-video:aspect-video prose-video:max-w-screen-sm dark:text-zinc-100 dark:prose-headings:text-zinc-100 dark:prose-a:text-zinc-200 dark:prose-strong:text-zinc-100",
        cardOpen ? "h-full opacity-100" : "pointer-events-none h-0 opacity-0",
      )}
    >
      {@html dompurify.sanitize(feedEntry.content ?? "")}
    </p>
    <p
      class={cn(
        "prose line-clamp-2 max-w-none transition-all dark:text-zinc-100 dark:prose-a:text-zinc-200",
        cardOpen ? "h-0" : "display-[-webkit-box]",
      )}
    >
      {@html feedEntry.contentSnippet}
    </p>
    <div class="flex gap-2 justify-start items-center mt-2 text-sm text-muted">
      {#if feedEntry.link}
        <img
          src={`https://${new URL(feedEntry.link).hostname}/favicon.ico`}
          alt="URL Favicon"
          class="rounded-full size-4"
        />
        <a target="_blank" href={feedEntry.link} class="line-clamp-1 text-clip">
          {feedEntry.link}
        </a>
      {/if}
    </div>
    <span class="flex flex-wrap gap-2 mt-2">
      <Badge variant="secondary">
        {format(feedEntry.createdAt, "H:mm d MMM yyyy")}
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
    />
  {/await}
</div>
