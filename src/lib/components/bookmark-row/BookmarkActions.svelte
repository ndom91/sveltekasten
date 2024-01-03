<script lang="ts">
  import { cn } from "$lib/utils"
  import { Button } from "$lib/components/ui/button"

  export let isOptionsOpen: boolean
  export let url: string
  export let handleMetadataSidebarOpen: () => void
  export let handleDeleteDialogOpen: () => void
</script>

<div
  class={cn(
    "absolute right-4 top-[calc(100%_/_2_-_1.75rem)] flex rounded-xl bg-zinc-200 bg-opacity-75 p-2 text-white transition-opacity delay-200 duration-300 ease-in-out dark:bg-zinc-950",
    isOptionsOpen ? "opacity-100" : "opacity-0",
  )}
>
  <Button variant="ghost" size="icon" href={url} target="_blank">
    <svg
      class="size-5 text-zinc-900 dark:text-zinc-100"
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
        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
      ></path>
    </svg>
  </Button>
  <Button variant="ghost" size="icon" on:click={handleMetadataSidebarOpen}>
    <svg
      class="size-5 text-zinc-900 dark:text-zinc-100"
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
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
      ></path>
    </svg>
  </Button>
  <Button variant="ghost" size="icon" on:click={handleDeleteDialogOpen}>
    <svg
      class="size-5 text-red-700"
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
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      ></path>
    </svg>
  </Button>
</div>
