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

  let { data } = $props()
  const table = createTable(writable(data.tags), {
    sort: addSortBy("name", "asc"),
  })
  const columns = table.createColumns([
    table.column({
      accessor: "id",
      header: "ID",
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "createdAt",
      header: "Created",
      cell: ({ value }) => format(value, "medium"),
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, { id: value })
      },
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
  <title>Briefkasten | Tags</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<Navbar simple />
<div class="flex overflow-y-scroll flex-col">
  <main class="p-4 mx-auto w-full">
    <div class="flex flex-col gap-2 justify-start align-start">
      <Table.Root {...$tableAttrs}>
        <Table.Header>
          {#each $headerRows as headerRow}
            <Subscribe rowAttrs={headerRow.attrs()}>
              <Table.Row class="hover:!bg-transparent">
                {#each headerRow.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs let:props props={cell.props()}>
                    <Table.Head {...attrs}>
                      {#if ["name", "createdAt"].includes(cell.id)}
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
                    <Table.Cell {...attrs}>
                      {#if cell.id === ""}
                        <div class="text-right">
                          <Render of={cell.render()} />
                        </div>
                      {:else if cell.id === "id"}
                        <div class="text-neutral-300 dark:text-neutral-700">
                          <Render of={cell.render()} />
                        </div>
                      {:else}
                        <Render of={cell.render()} />
                      {/if}
                    </Table.Cell>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Body>
      </Table.Root>
      <form
        method="post"
        action="?/createTag"
        use:enhance={handleActionResults()}
        class="flex gap-4 justify-start items-center"
      >
        <div class="flex gap-2">
          <svg
            class="size-6"
            data-slot="icon"
            fill="none"
            stroke-width="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            ></path>
          </svg>
          <span> Create New </span>
        </div>
        <Input
          class="w-48"
          placeholder="Tag Name"
          id="name"
          name="name"
          type="text"
          data-1p-ignore
        />
        <Button variant="secondary" type="submit" class="w-24">Create</Button>
      </form>
    </div>
  </main>
</div>
