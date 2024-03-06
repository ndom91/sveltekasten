<script lang="ts">
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import { enhance } from "$app/forms"
  import { handleActionResults } from "$lib/utils/form-action"
  import * as Card from "$lib/components/ui/card"
  import { buttonVariants } from "$lib/components/ui/button"
  import DeleteDialog from "./DeleteDialog.svelte"
  import type { Feed } from "$zod"

  let isDeleteDialogOpen = $state(false)
  let targetFeed = $state<Feed>()

  const handleToggleDeleteDialog = (e: MouseEvent, feed: Feed) => {
    e.preventDefault()
    e.stopPropagation()
    isDeleteDialogOpen = !isDeleteDialogOpen
    targetFeed = feed
  }
</script>

<DeleteDialog form={$page.form} bind:open={isDeleteDialogOpen} feed={targetFeed} />
<div class="flex flex-col gap-2 justify-start items-start">
  <Card.Root class="w-full shadow-none">
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title>Manage Feeds</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-2 items-start" role="table">
        <div class="flex justify-start items-center w-full" role="rowheader">
          <div class="w-72">ID</div>
          <div class="flex-grow">URL</div>
          <div class="w-24">Actions</div>
        </div>
        {#each $page.data?.feeds?.data as feed}
          <div class="flex justify-start items-center w-full" role="row">
            <div class="w-64 font-mono" role="cell">
              {feed.id}
            </div>
            <div class="flex-grow font-mono truncate" role="cell">
              {feed.url}
            </div>
            <div class="w-24" role="cell">
              <Button
                onclick={(e: MouseEvent) => handleToggleDeleteDialog(e, feed)}
                class="bg-red-500 dark:bg-red-700"
                variant="destructive"
              >
                <svg
                  class="mr-2 size-4"
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
                Delete
              </Button>
            </div>
          </div>
        {:else}
          <div class="flex justify-start items-center w-full" role="row">
            <div class="my-8 w-full text-center" role="cell">
              No feeds added yet, please use the form below to add your first!
            </div>
          </div>
        {/each}
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full shadow-none">
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title>Add Feed</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <form
        action="/settings?/addFeed"
        method="post"
        use:enhance={handleActionResults()}
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
