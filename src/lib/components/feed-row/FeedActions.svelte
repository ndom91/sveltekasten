<script lang="ts">
  import { cn } from "$lib/utils"
  import { Button } from "$lib/components/ui/button"

  export let isOptionsOpen: boolean
  export let url: string
  export let handleMetadataSidebarOpen: () => void
  export let toggleCardOpen: () => void
</script>

<div
  class={cn(
    "absolute right-4  top-16 flex rounded-xl bg-zinc-200 bg-opacity-90 p-2 text-white transition-opacity delay-200 duration-300 ease-in-out dark:bg-zinc-950 dark:bg-opacity-100",
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
  <Button variant="ghost" size="icon" on:click={toggleCardOpen}>
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
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
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
</div>
