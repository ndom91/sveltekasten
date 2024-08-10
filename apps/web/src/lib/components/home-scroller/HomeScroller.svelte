<script lang="ts">
  import { watch } from "runed"
  import BookmarkPreviewCard from "./BookmarkPreviewCard.svelte"
  import FeedItemPreviewCard from "./FeedItemPreviewCard.svelte"
  import Bell from "$lib/assets/bell.png"
  import Browser from "$lib/assets/browser.png"
  import { ScrollerTypes } from "$lib/types"
  import { capitalize } from "$lib/utils"

  type Props = {
    type: keyof typeof ScrollerTypes
    items: LoadBookmarkFlatTags[] | LoadFeedEntry[]
    count: number
  }

  const { type, items, count }: Props = $props()

  let element = $state<HTMLElement | undefined>()

  watch(
    () => items,
    () => {
      element?.scrollTo(0, 0)
    },
  )
</script>

<section
  class="flex relative flex-col mx-4 max-w-full rounded-lg bg-neutral-100 dark:bg-neutral-900"
>
  <div class="flex z-10 flex-grow justify-between mx-4 mt-3">
    <h2 class="text-xl font-thin">
      {type === ScrollerTypes.FEEDS ? `Unread Feed Items (${count})` : capitalize(type)}
    </h2>
    {#if items.length}
      <a
        class="flex gap-2 items-center p-1 rounded-md transition focus:ring-2 focus:outline-none focus:ring-neutral-300 focus:dark:ring-neutral-700"
        data-sveltekit-preload-data="hover"
        href={`/${type.toLowerCase()}`}
      >
        <svg
          class="size-5 text-neutral-700 dark:text-neutral-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none" />
          <line
            x1="40"
            y1="64"
            x2="216"
            y2="64"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="40"
            y1="128"
            x2="112"
            y2="128"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="40"
            y1="192"
            x2="128"
            y2="192"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <circle
            cx="184"
            cy="144"
            r="32"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="206.63"
            y1="166.63"
            x2="232"
            y2="192"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
        </svg>
        <span class="text-neutral-700 truncate dark:text-neutral-400">See more</span>
      </a>
    {/if}
  </div>
  <div
    bind:this={element}
    class="flex overflow-x-scroll gap-4 py-4 px-4 scroll-px-4 scroll-smooth snap-x snap-mandatory after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-full after:w-24 after:shadow-[inset_-100px_0px_65px_-65px_#ddd] dark:after:shadow-[inset_-100px_0px_45px_-65px_#141414] after:rounded-r-lg"
  >
    {#each items.values() as item (item.id)}
      {#if type === ScrollerTypes.BOOKMARKS}
        <BookmarkPreviewCard item={item as LoadBookmark} />
      {:else if type === ScrollerTypes.FEEDS}
        <FeedItemPreviewCard item={item as LoadFeedEntry} />
      {/if}
    {:else}
      <div class="grid place-items-center w-full h-48">
        {#if type === ScrollerTypes.BOOKMARKS}
          <div class="z-10">
            Go to the <a href="/bookmarks" class="underline underline-offset-4">bookmarks</a> page to
            find multiple ways to add new bookmarks
          </div>
          <img
            src={Browser}
            alt="Empty State Browser"
            class="absolute -right-4 -bottom-20 w-72 max-w-md opacity-20 pointer-events-none rotate-[18deg] grayscale dark:invert"
          />
        {:else if type === ScrollerTypes.FEEDS}
          <div class="z-10">
            Go to <a href="/settings?tab=feeds" class="underline underline-offset-4">settings</a> to
            add a new RSS feed to follow
          </div>
          <img
            src={Bell}
            alt="Empty State Browser"
            class="absolute -right-4 -bottom-16 w-64 max-w-md opacity-20 pointer-events-none rotate-[10deg] grayscale dark:invert"
          />
        {/if}
      </div>
    {/each}
  </div>
</section>
