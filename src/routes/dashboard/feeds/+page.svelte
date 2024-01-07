<script lang="ts">
  import { FeedRow } from "$lib/components/feed-row"
  import * as Table from "$lib/components/ui/table"
  import * as Pagination from "$lib/components/ui/pagination"

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
        feedEntry.contentSnippet?.toLowerCase().includes(query) ||
        feedEntry.link?.toLowerCase().includes(query)
      )
    })
  })
</script>

<main class="h-full">
  <div
    class="align-start flex max-h-[calc(100vh_-_80px)] flex-col justify-start gap-2 overflow-y-scroll"
  >
    {#if data.feedEntries}
      <Table.Root>
        <Table.Body>
          {#each activeFeedEntries() as feedEntry}
            <FeedRow {feedEntry} />
          {/each}
        </Table.Body>
      </Table.Root>
      <div class="fixed bottom-8 flex w-full justify-center">
        <Pagination.Root
          class="w-auto rounded-xl border-2 bg-zinc-950 p-2 dark:border-zinc-700"
          count={100}
          perPage={10}
          let:pages
          let:currentPage
        >
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.PrevButton />
            </Pagination.Item>
            {#each pages as page (page.key)}
              {#if page.type === "ellipsis"}
                <Pagination.Item>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              {:else}
                <Pagination.Item>
                  <Pagination.Link {page} isActive={currentPage == page.value}>
                    {page.value}
                  </Pagination.Link>
                </Pagination.Item>
              {/if}
            {/each}
            <Pagination.Item>
              <Pagination.NextButton />
            </Pagination.Item>
          </Pagination.Content>
        </Pagination.Root>
      </div>
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
