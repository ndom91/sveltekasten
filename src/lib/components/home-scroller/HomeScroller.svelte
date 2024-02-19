<script lang="ts">
  import FeedItemPreviewCard from "./FeedItemPreviewCard.svelte"
  import BookmarkPreviewCard from "./BookmarkPreviewCard.svelte"

  type ScrollerProps = {
    type: "bookmarks" | "feeds"
    items: (LoadBookmarkResult | LoadFeedEntry)[]
    count: number
  }

  const { type, items, count } = $props<ScrollerProps>()
</script>

<section class="flex flex-col mx-4 max-w-full rounded-lg bg-zinc-900">
  <div class="flex flex-grow justify-between mx-4 mt-4">
    <h2 class="text-2xl font-thin">
      {type === "feeds"
        ? `Unread ${type.charAt(0).toUpperCase() + type.slice(1)}`
        : type.charAt(0).toUpperCase() + type.slice(1)}
    </h2>
    {#if items.length}
      <a data-sveltekit-preload-data="hover" href={`/${type}`}>See more</a>
    {/if}
  </div>
  <div class="flex overflow-x-auto">
    {#each items as item (item.id)}
      {#if type === "bookmarks"}
        <BookmarkPreviewCard {item} />
      {:else if type === "feeds"}
        <FeedItemPreviewCard {item} />
      {/if}
    {:else}
      <div class="grid place-items-center w-full h-24">
        <p>No items found</p>
      </div>
    {/each}
  </div>
</section>
