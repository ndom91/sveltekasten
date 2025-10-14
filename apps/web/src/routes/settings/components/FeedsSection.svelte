<script lang="ts">
  import { format } from "@formkit/tempo"
  import { tick } from "svelte"
  import { writable } from "svelte/store"
  import { Render, Subscribe, createRender, createTable } from "svelte-headless-table"
  import { addSortBy } from "svelte-headless-table/plugins"
  import { toast } from "svelte-sonner"
  import DeleteDialog from "./DeleteDialog.svelte"
  import DataTableActions from "./feed-data-table-actions.svelte"
  import type { Feed } from "$lib/types/zod.js"
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import { page } from "$app/state"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Table from "$lib/components/ui/table"
  import { handleActionResults } from "$lib/utils/form-action"

  let isDeleteDialogOpen = $state(false)
  let targetFeed = $state<Feed>()

  const handleToggleDeleteDialog = (feedId: string) => {
    targetFeed = page.data.feeds?.data.find((feed: Feed) => feed.id === feedId)
    isDeleteDialogOpen = !isDeleteDialogOpen
  }

  const checkQueueResults = () => {
    void tick().then(() =>
      toast.promise(invalidateAll, {
        loading: "Loading..",
        success: "Feed Added",
        error: "Error adding feed, please try again",
      }),
    )
  }

  const feedsStore = writable(page.data.feeds?.data)

  $effect(() => {
    if (page.data?.feeds?.data) {
      feedsStore.set(page.data.feeds.data)
    }
  })

  const table = createTable(feedsStore, {
    sort: addSortBy(),
  })

  const columns = table.createColumns([
    table.column({
      // @ts-expect-error string is allowed
      accessor: "id",
      header: "ID",
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
    table.column({
      // @ts-expect-error string is allowed
      accessor: "name",
      header: "Name",
    }),
    table.column({
      // @ts-expect-error string is allowed
      accessor: "url",
      header: "URL",
    }),
    table.column({
      // @ts-expect-error feedEntries is number
      accessor: ({ _count }) => _count.feedEntries as number,
      id: "count",
      header: "Entries",
    }),
    table.column({
      // @ts-expect-error string is allowed
      accessor: "lastFetched",
      header: "Last Fetched",
      cell: ({ value }) => format(value, { date: "medium", time: "medium" }),
    }),
    table.column({
      // @ts-expect-error string is allowed
      accessor: "createdAt",
      header: "Created",
      cell: ({ value }) => format(value, "medium"),
    }),
    table.column({
      // @ts-expect-error string is allowed
      accessor: "actions",
      header: "",
      cell: (data) =>
        createRender(DataTableActions, {
          // @ts-expect-error - original does exist in this case
          id: data.row.original.id,
          toggleDeleteDialog: handleToggleDeleteDialog,
        }),
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
  ])

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns)
</script>

<DeleteDialog form={page.form} bind:open={isDeleteDialogOpen} feed={targetFeed!} />
<div class="flex flex-col gap-2 justify-start items-start">
  <Card.Root class="w-full rounded-md shadow-none bg-transparent">
    <Card.Header class="bg-neutral-100 dark:bg-neutral-800 rounded-t-md">
      <Card.Title>Manage Feeds</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <Table.Root {...$tableAttrs}>
        <Table.Header>
          {#each $headerRows as headerRow}
            <Subscribe rowAttrs={headerRow.attrs()}>
              <Table.Row class="hover:bg-transparent!">
                {#each headerRow.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs let:props props={cell.props()}>
                    <Table.Head {...attrs} class={cell.id === "id" ? "hidden lg:table-cell" : ""}>
                      {#if ["name", "createdAt", "count"].includes(cell.id)}
                        <Button class="text-left" variant="ghost" on:click={props.sort.toggle}>
                          <Render of={cell.render()} />
                          <svg
                            class="ml-2 fill-neutral-800 size-4 dark:fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            ><rect width="256" height="256" fill="none" /><polyline
                              points="80 176 128 224 176 176"
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="16"
                            /><polyline
                              points="80 80 128 32 176 80"
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="16"
                            /></svg
                          >
                        </Button>
                      {:else}
                        <div class="text-left">
                          <Render of={cell.render()} />
                        </div>
                      {/if}
                    </Table.Head>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
          {#each $pageRows as row (row.id)}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
              <Table.Row {...rowAttrs} class="bg-transparent hover:dark:bg-neutral-900/20">
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    {#if cell.id === ""}
                      <Table.Cell class="text-right max-w-20" {...attrs}>
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {:else if cell.id === "count"}
                      <Table.Cell class="text-center max-w-4" {...attrs}>
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {:else if cell.id === "name"}
                      <!-- @ts-expect-error -->
                      <Table.Cell class="max-w-48 truncate" title={cell.value} {...attrs}>
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {:else if cell.id === "lastFetched"}
                      <!-- @ts-expect-error -->
                      <Table.Cell class="max-w-48 truncate" title={cell.value} {...attrs}>
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {:else if cell.id === "url"}
                      <!-- @ts-expect-error -->
                      <Table.Cell class="max-w-48 truncate" title={cell.value} {...attrs}>
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {:else if cell.id === "actions"}
                      <Table.Cell class="w-32 max-w-32" {...attrs}>
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {:else if cell.id === "id"}
                      <Table.Cell
                        class="hidden lg:block lg:w-48 text-neutral-400 truncate lg:max-w-48 dark:text-neutral-600"
                        {...attrs}
                      >
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {:else}
                      <Table.Cell class="" {...attrs}>
                        <Render of={cell.render()} />
                      </Table.Cell>
                    {/if}
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full shadow-none bg-transparent">
    <Card.Header class="bg-neutral-100 dark:bg-neutral-800 rounded-t-md">
      <Card.Title>Add Feed</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <form
        action="/settings?/addFeed"
        method="post"
        use:enhance={handleActionResults(checkQueueResults)}
        class="flex gap-2"
      >
        <input
          type="text"
          name="feedUrl"
          placeholder="RSS Feed URL"
          class="flex py-2 px-3 w-96 h-10 text-sm bg-transparent rounded-md border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
        />
        <button class={buttonVariants({ variant: "default" })} type="submit"> Add </button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
