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
  const tagStore = writable(data.tags)

  $effect(() => {
    if (data.tags) {
      tagStore.set(data.tags)
    }
  })

  const table = createTable(tagStore, {
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
  <title>Briefkasten | Tags</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<Navbar simple />
<main
  class="p-4 align-start overflow-y-scroll flex max-h-[calc(100vh_-_80px)] w-full flex-col justify-start gap-2"
>
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row class="hover:!bg-transparent">
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs let:props props={cell.props()}>
                <Table.Head {...attrs} class={cell.id === "id" ? "hidden lg:table-cell" : ""}>
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
                {#if cell.id === ""}
                  <Table.Cell class="text-right max-w-24" {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                {:else if cell.id === "name"}
                  <Table.Cell class="w-full" {...attrs}>
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
    </div>
    <Input class="w-80" placeholder="Tag Name" id="name" name="name" type="text" data-1p-ignore />
    <Button variant="secondary" type="submit" class="w-24">Save</Button>
  </form>
</main>
