<script lang="ts">
  import { page } from "$app/stores"
  import { BookmarkCard } from "$lib/components/bookmark-card"
</script>

<div class="mx-auto max-w-7xl px-4">
  <main class="">
    <div class="grid grid-flow-col grid-cols-3 gap-2">
      {#each $page.data.bookmarks as bookmark}
        <BookmarkCard {bookmark} />
      {/each}
    </div>
  </main>
</div>
