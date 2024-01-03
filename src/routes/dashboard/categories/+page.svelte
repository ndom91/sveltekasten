<script lang="ts">
  import * as Table from "$lib/components/ui/table"

  let { data } = $props()
</script>

<main class="mx-auto w-full p-4">
  <div class="align-start flex flex-col justify-start gap-2">
    <Table.Root>
      <Table.Caption>Categories</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-[100px]">Name</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head class="text-right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each data.categories as category (category.id)}
          <Table.Row>
            <Table.Cell class="font-medium">{category.name}</Table.Cell>
            <Table.Cell>Paid</Table.Cell>
            <Table.Cell>Credit Card</Table.Cell>
            <Table.Cell class="text-right">$250.00</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</main>
