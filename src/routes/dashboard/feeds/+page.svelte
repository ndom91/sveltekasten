<script lang="ts">
  import { goto } from "$app/navigation"
  import { FeedRow } from "$lib/components/feed-row"
  import * as Table from "$lib/components/ui/table"
  import * as Pagination from "$lib/components/ui/pagination"

  import { useInterface } from "$state/ui.svelte"
  import EmptyIllustration from "$lib/assets/empty-state.png"
  import Arrow from "$lib/assets/arrow.svg"
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"

  const ui = useInterface()
  const { data } = $props()
  let page = $state(1)
  let totalItems = $state<number>(data.count ?? 1)

  if (data.error) {
    console.error(data.error)
  }

  let activeFeedEntries = $derived(async () => {
    if (!ui.searchQuery) return data.feedEntries
    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ui.searchQuery,
      }),
    })
    const { data: searchResults, count } = await res.json()
    totalItems = count
    return searchResults
  })

  const handlePageChange = (p: number) => {
    page = p
    const limit = 10
    const skip = (page - 1) * limit
    goto(`?skip=${skip}`, {
      noScroll: true,
      keepFocus: true,
    })
  }
</script>

<svelte:head>
  <title>Briefkasten | Feeds</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<main class="h-full">
  <div class="align-start flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2">
    {#if data.feedEntries}
      <Table.Root>
        <Table.Body>
          {#await activeFeedEntries()}
            <tr class="text-3xl">
              <td colspan="2" class="h-24" align="center">Loading...</td>
            </tr>
          {:then feedEntries}
            {#if feedEntries.length}
              {#each feedEntries as feedEntry}
                <FeedRow {feedEntry} />
              {/each}
            {:else}
              <tr class="text-3xl">
                <td colspan="2" class="h-24" align="center">No entries found</td>
              </tr>
            {/if}
          {:catch error}
            <tr class="text-3xl">
              <td colspan="2" class="h-24" align="center">{error}</td>
            </tr>
          {/await}
        </Table.Body>
      </Table.Root>
      <div class="fixed bottom-8 flex w-full justify-center">
        {#if totalItems > 1}
          <Pagination.Root
            class="w-auto rounded-xl border-2 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-950"
            count={totalItems}
            perPage={10}
            {page}
            onPageChange={handlePageChange}
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
        {/if}
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
