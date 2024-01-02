<script lang="ts">
  import { page } from "$app/stores"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import * as Table from "$lib/components/ui/table"
  import { useInterface } from "$state/ui.svelte"
  import type { Bookmark } from "$lib/types"

  const ui = useInterface()

  let activeBookmarks = $derived(() => {
    if (!ui.searchQuery) return $page.data.bookmarks
    return $page.data.bookmarks.filter((bookmark: Bookmark) => {
      const query = ui.searchQuery.toLowerCase()
      return (
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.desc.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query) ||
        bookmark.url?.toLowerCase().includes(query)
      )
    })
  })
</script>

<main class="mx-auto w-full p-4">
  <div class="align-start flex flex-col justify-start gap-2">
    <Table.Root>
      <Table.Header>
        <Table.Row class="rounded-md">
          <Table.Head class="w-24 text-left"></Table.Head>
          <Table.Head class="text-center">Bookmark</Table.Head>
          <Table.Head class="w-32 text-center">Date</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each activeBookmarks() as bookmark}
          <BookmarkRow {bookmark} />
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</main>
