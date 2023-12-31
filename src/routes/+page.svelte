<script lang="ts">
  import { page } from "$app/stores"
  import { BookmarkCard } from "$lib/components/bookmark-card"
</script>

<div class="mx-auto max-w-7xl p-4">
  <main class="">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      {#each $page.data.bookmarks as bookmark}
        <BookmarkCard {bookmark} />
      {/each}
    </div>
  </main>
</div>
