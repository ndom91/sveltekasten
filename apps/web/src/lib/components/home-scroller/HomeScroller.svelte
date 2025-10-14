<script lang="ts">
import { watch } from "runed";
import BookmarkPreviewCard from "./BookmarkPreviewCard.svelte";
import FeedItemPreviewCard from "./FeedItemPreviewCard.svelte";
import Bell from "$lib/assets/bell.png";
import Browser from "$lib/assets/browser.png";
import { ScrollerTypes } from "$lib/types";
import { capitalize } from "$lib/utils/text";

type Props = {
  type: keyof typeof ScrollerTypes;
  items: LoadBookmarkFlatTags[] | LoadFeedEntry[];
  count: number;
};

const { type, items, count }: Props = $props();

let element = $state<HTMLElement | undefined>();

watch(
  () => items,
  () => {
    element?.scrollTo(0, 0);
  },
);
</script>

<section
  class="relative mx-4 flex max-w-full flex-col overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900"
>
  <div class="z-10 mx-4 mt-3 flex grow justify-between">
    <h2 class="text-xl font-thin">
      {type === ScrollerTypes.FEEDS ? `Unread Feed Items (${count})` : capitalize(type)}
    </h2>
    {#if items.length}
      <a
        class="flex items-center gap-2 rounded-md p-1 transition focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:dark:ring-neutral-700"
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
        <span class="truncate text-neutral-700 dark:text-neutral-400">See more</span>
      </a>
    {/if}
  </div>
  <div
    bind:this={element}
    class="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-scroll scroll-smooth px-4 py-4 after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-full after:w-24 after:rounded-r-lg after:shadow-[inset_-100px_0px_65px_-65px_#ddd] dark:after:shadow-[inset_-100px_0px_45px_-65px_#141414]"
  >
    {#each items as item (item.id)}
      {#if type === ScrollerTypes.BOOKMARKS}
        <BookmarkPreviewCard {item} />
      {:else if type === ScrollerTypes.FEEDS}
        <FeedItemPreviewCard {item} />
      {/if}
    {:else}
      <div class="grid h-48 w-full place-items-center">
        {#if type === ScrollerTypes.BOOKMARKS}
          <div class="z-10">
            Go to the <a href="/bookmarks" class="underline underline-offset-4">bookmarks</a> page to
            find multiple ways to add new bookmarks
          </div>
          <img
            src={Browser}
            alt="Empty State Browser"
            class="pointer-events-none absolute -bottom-20 -right-4 w-72 max-w-md rotate-18 opacity-20 grayscale dark:invert"
          />
        {:else if type === ScrollerTypes.FEEDS}
          <div class="z-10">
            Go to <a href="/settings?tab=feeds" class="underline underline-offset-4">settings</a> to
            add a new RSS feed to follow
          </div>
          <img
            src={Bell}
            alt="Empty State Browser"
            class="pointer-events-none absolute -bottom-16 -right-4 w-64 max-w-md rotate-10 opacity-20 grayscale dark:invert"
          />
        {/if}
      </div>
    {/each}
  </div>
</section>
