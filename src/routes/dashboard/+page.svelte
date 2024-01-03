<script lang="ts">
  import { BookmarkRow } from "$lib/components/bookmark-row"
  import * as Table from "$lib/components/ui/table"
  import { useInterface } from "$state/ui.svelte"
  import EmptyIllustration from "$lib/assets/empty-state.png"
  import Arrow from "$lib/assets/arrow.svg"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"

  const ui = useInterface()
  const { data } = $props()

  let activeBookmarks = $derived(() => {
    if (!ui.searchQuery) return data.bookmarks
    return data.bookmarks?.filter((bookmark) => {
      const query = ui.searchQuery.toLowerCase()
      return (
        bookmark.title?.toLowerCase().includes(query) ||
        bookmark.desc?.toLowerCase().includes(query) ||
        bookmark.url?.toLowerCase().includes(query)
      )
    })
  })
</script>

<main class="mx-auto w-full p-4">
  <div class="align-start flex flex-col justify-start gap-2">
    {#if data.bookmarks}
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
    {:else}
      <img src={Arrow} alt="Arrow" class="absolute right-28 top-28" />
      <div class="relative mx-auto w-1/2">
        <img src={EmptyIllustration} alt="Empty" />
        <p class="mb-4 text-center text-2xl font-light">Looks like there's nothing here!</p>
        <p class="text-center text-muted-foreground">
          Get started by adding a bookmark with the "+" button above or by pressing <KeyboardIndicator
            class="text-sm text-white"
            key="Alt N"
          />
        </p>
      </div>
    {/if}
  </div>
</main>
