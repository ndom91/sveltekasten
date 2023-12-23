<script lang="ts">
  import { page } from "$app/stores"
  import BookmarkCard from "$lib/components/BookmarkCard.svelte"
</script>

<div class="max-w-7xl mx-auto px-4">
  <main class="">
    <div class="grid grid-flow-col grid-cols-3 gap-2">
      {#each $page.data.bookmarks as bookmark}
        <BookmarkCard {bookmark} />
      {/each}
    </div>
  </main>
</div>
