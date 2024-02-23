<script lang="ts">
  import * as Table from "$lib/components/ui/table"
  import { Navbar } from "$lib/components/navbar"
  import { enhance } from "$app/forms"
  import { handleActionResults } from "$lib/utils/form-action"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { format } from "@formkit/tempo"

  let { data } = $props()
</script>

<svelte:head>
  <title>Briefkasten | Categories</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<Navbar simple />
<div class="flex overflow-y-scroll flex-col items-center">
  <main class="p-4 mx-auto w-full max-w-screen-2xl">
    <div class="flex flex-col gap-2 justify-start align-start">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-1/4 min-w-48">Name</Table.Head>
            <Table.Head>Description</Table.Head>
            <Table.Head class="text-right">Created At</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.categories as category (category.id)}
            <Table.Row>
              <Table.Cell class="font-medium">{category.name}</Table.Cell>
              <Table.Cell>{category.description}</Table.Cell>
              <Table.Cell class="text-right">{format(category.createdAt, "medium")}</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
      <form
        method="post"
        action="?/createCategory"
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
        <Input class="w-48" placeholder="Name" id="name" name="name" type="text" />
        <Input
          class="w-48"
          placeholder="Description"
          id="description"
          name="description"
          type="text"
        />
        <Button variant="secondary" type="submit" class="w-24">Create</Button>
      </form>
    </div>
  </main>
</div>
