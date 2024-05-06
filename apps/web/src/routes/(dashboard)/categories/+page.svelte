<script lang="ts">
  import * as Table from "$lib/components/ui/table"
  import { Navbar } from "$lib/components/navbar"
  import { enhance } from "$app/forms"
  import { handleActionResults } from "$lib/utils/form-action"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { format } from "@formkit/tempo"
  import { writable } from "svelte/store"
  import { createTable, Render, Subscribe, createRender } from "svelte-headless-table"
  import { addSortBy } from "svelte-headless-table/plugins"
  import DataTableActions from "./data-table-actions.svelte"

  let { data }: { data: any } = $props()
  const categoryStore = writable(data.categories)

  $effect(() => {
    if (data.categories) {
      categoryStore.set(data.categories)
    }
  })

  const table = createTable(categoryStore, {
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
      accessor: "description",
      header: "Description",
    }),
    table.column({
      // @ts-expect-error string is allowed
      accessor: "createdAt",
      header: "Created",
      cell: ({ value }) => format(value, "medium"),
    }),
    table.column({
      // @ts-expect-error
      accessor: "actions",
      header: "",
      // @ts-expect-error
      cell: (data) => createRender(DataTableActions, { id: data.row.original.id }),
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
  ])

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns)
</script>

<svelte:head>
  <title>Briefkasten | Categories</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<Navbar simple />
<main
  class="p-4 align-start overflow-y-scroll flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2"
>
  <form
    method="post"
    action="?/createCategory"
    use:enhance={handleActionResults()}
    class="flex gap-4 justify-start items-center py-4"
  >
    <Input class="w-60" placeholder="Name" id="name" name="name" type="text" />
    <Input class="w-96" placeholder="Description" id="description" name="description" type="text" />
    <Button variant="secondary" type="submit" class="w-24">Save</Button>
  </form>
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row class="hover:!bg-transparent">
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs let:props props={cell.props()}>
                <Table.Head {...attrs} class={cell.id === "id" ? "hidden lg:table-cell" : ""}>
                  {#if ["name", "description", "createdAt"].includes(cell.id)}
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
          <Table.Row {...rowAttrs} class="hover:dark:bg-neutral-900/20">
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                {#if cell.id === "name"}
                  <Table.Cell class="w-80 max-w-xs" {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                {:else if cell.id === "description"}
                  <Table.Cell class="w-96 max-w-sm" {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                {:else if cell.id === "actions"}
                  <Table.Cell class="w-32 text-right max-w-32" {...attrs}>
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
</main>
