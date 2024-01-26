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

<section class="flex mx-4 rounded-md bg-zinc-900">
  {#each items as item (item.id)}
    {#if type === "bookmarks"}
      <BookmarkPreviewCard {item} />
    {:else if type === "feeds"}
      <FeedItemPreviewCard {item} />
    {/if}
  {:else}
    <p>No items found</p>
  {/each}
</section>
