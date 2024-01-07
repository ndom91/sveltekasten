<script lang="ts">
  import { FeedRow } from "$lib/components/feed-row"
  import * as Table from "$lib/components/ui/table"
  import { useInterface } from "$state/ui.svelte"
  import EmptyIllustration from "$lib/assets/empty-state.png"
  import Arrow from "$lib/assets/arrow.svg"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"

  const ui = useInterface()
  const { data } = $props()

  if (data.error) {
    console.error(data.error)
  }

  let activeFeedEntries = $derived(() => {
    if (!ui.searchQuery) return data.feedEntries
    return data.feedEntries?.filter((feedEntry) => {
      const query = ui.searchQuery.toLowerCase()
      return (
        feedEntry.title?.toLowerCase().includes(query) ||
        feedEntry.desc?.toLowerCase().includes(query) ||
        feedEntry.url?.toLowerCase().includes(query)
      )
    })
  })
</script>

<main class="mx-auto w-full overflow-x-hidden overflow-y-scroll p-4">
  <div class="align-start flex flex-col justify-start gap-2">
    {#if data.feedEntries}
      <Table.Root>
        <Table.Header>
          <Table.Row class="rounded-md">
            <Table.Head class="w-48 text-left"></Table.Head>
            <Table.Head class="max-w-[60vw] text-center">Feed</Table.Head>
            <Table.Head class="w-32 text-center">Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each activeFeedEntries() as feedEntry}
            <FeedRow {feedEntry} />
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
