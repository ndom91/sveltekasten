<script lang="ts">
  import FeedItemPreviewCard from "./FeedItemPreviewCard.svelte"
  import BookmarkPreviewCard from "./BookmarkPreviewCard.svelte"
  import { ScrollerTypes } from "$lib/types"
  import { capitalize } from "$lib/utils"

  type ScrollerProps = {
    type: keyof typeof ScrollerTypes
    items: (LoadBookmark | LoadFeedEntry)[]
    count: number
  }

  const { type, items, count } = $props<ScrollerProps>()
</script>

<section
  class="relative flex flex-col mx-4 max-w-full rounded-lg dark:bg-neutral-900 bg-neutral-100 overflow-hidden after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-96 after:w-24 after:shadow-[inset_-100px_0px_65px_-65px_#ddd] dark:after:shadow-[inset_-100px_0px_45px_-65px_#141414]"
>
  <div class="flex z-10 flex-grow justify-between mx-4 mt-3 mr-8">
    <h2 class="text-xl font-thin">
      {type === ScrollerTypes.FEEDS ? `Unread ${capitalize(type)}` : capitalize(type)}
    </h2>
    <div class="flex gap-6 items-center">
      {#if items.length && type === ScrollerTypes.FEEDS}
        <button class="flex gap-2 items-center" data-sveltekit-preload-data="hover">
          <svg
            class="size-5 text-neutral-700 dark:text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            ><rect width="256" height="256" fill="none" /><rect
              x="53.87"
              y="34.21"
              width="148.27"
              height="187.59"
              rx="8"
              transform="translate(24.22 -20.31) rotate(10.02)"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /><line
              x1="97.22"
              y1="59.81"
              x2="180.2"
              y2="74.47"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /><line
              x1="174.66"
              y1="105.98"
              x2="91.67"
              y2="91.33"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /><line
              x1="127.62"
              y1="130.17"
              x2="86.13"
              y2="122.84"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /></svg
          >
          <span class="text-neutral-700 dark:text-neutral-400">Mark as Read ({count})</span>
        </button>
      {/if}
      {#if items.length}
        <a class="flex gap-2 items-center" data-sveltekit-preload-data="hover" href={`/${type}`}>
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
          <span class="text-neutral-700 dark:text-neutral-400">See more</span>
        </a>
      {/if}
    </div>
  </div>
  <div class="flex overflow-x-scroll gap-4 py-2 px-4">
    {#each items as item (item.id)}
      {#if type === ScrollerTypes.BOOKMARKS}
        <BookmarkPreviewCard item={item as LoadBookmark} />
      {:else if type === ScrollerTypes.FEEDS}
        <FeedItemPreviewCard item={item as LoadFeedEntry} />
      {/if}
    {:else}
      <div class="grid place-items-center w-full h-24">
        <p>No items found</p>
      </div>
    {/each}
  </div>
</section>
