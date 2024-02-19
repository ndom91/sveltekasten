<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Button } from "$lib/components/ui/button"

  const { id } = $props<{ id: string }>()

  const handleDelete = async () => {
    console.log("Delete", id)
    await fetch(`/api/v1/tags`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
  }

  const handleEdit = async () => {
    console.log("Edit", id)
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]} size="icon" class="relative p-0 w-8 h-8">
      <span class="sr-only">Open menu</span>
      <svg
        class="fill-neutral-800 size-6 dark:fill-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
      >
        <rect width="256" height="256" fill="none" />
        <circle cx="128" cy="128" r="12" />
        <circle cx="196" cy="128" r="12" />
        <circle cx="60" cy="128" r="12" />
      </svg>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item onclick={handleEdit}>
        <svg
          class="mr-2 size-5 text-neutral-300 dark:text-neutral-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          ><rect width="256" height="256" fill="none" /><path
            d="M92.69,216H48a8,8,0,0,1-8-8V163.31a8,8,0,0,1,2.34-5.65L165.66,34.34a8,8,0,0,1,11.31,0L221.66,79a8,8,0,0,1,0,11.31L98.34,213.66A8,8,0,0,1,92.69,216Z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="136"
            y1="64"
            x2="192"
            y2="120"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /></svg
        >
        Edit
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={handleDelete}>
        <svg
          class="mr-2 text-red-400 size-5 dark:text-red-400/50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          ><rect width="256" height="256" fill="none" /><line
            x1="216"
            y1="56"
            x2="40"
            y2="56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="104"
            y1="104"
            x2="104"
            y2="168"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="152"
            y1="104"
            x2="152"
            y2="168"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><path
            d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><path
            d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /></svg
        >
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
