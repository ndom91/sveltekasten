<script lang="ts">
  import { page } from "$app/stores"
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import * as Table from "$lib/components/ui/table"
</script>

<div class="mx-auto p-4">
  <main class="align-start flex flex-col justify-start gap-2">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-24 text-left"></Table.Head>
          <Table.Head class="text-center">Bookmark</Table.Head>
          <Table.Head class="w-32 text-center">Date</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each $page.data.bookmarks as bookmark}
          <BookmarkRow {bookmark} />
        {/each}
      </Table.Body>
    </Table.Root>
  </main>
</div>
