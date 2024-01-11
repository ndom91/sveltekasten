<script lang="ts">
  import { page } from "$app/stores"
  import { enhance } from "$app/forms"
  import { form_action } from "$lib/form_action"
  import { buttonVariants } from "$lib/components/ui/button"
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import { Navbar } from "$lib/components/navbar"
  import { CommandBar } from "$lib/components/command-bar"
  import * as Tabs from "$lib/components/ui/tabs"
  import * as Card from "$lib/components/ui/card"
  import { Button } from "$lib/components/ui/button"
  import type { Feed } from "$zod"

  let isDeleteDialogOpen = $state(false)
  let targetFeed = $state<Feed>()

  const handleToggleDeleteDialog = (e: MouseEvent, feed: Feed) => {
    e.preventDefault()
    isDeleteDialogOpen = !isDeleteDialogOpen
    targetFeed = feed
  }
</script>

<svelte:head>
  <title>Briefkasten | Settings</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class="flex">
  <CommandBar />
  <Sidebar />
  <div class="flex w-full flex-grow flex-col">
    <Navbar simple={true} />

    {#await import("./components/DeleteDialog.svelte") then { default: DeleteDialog }}
      <svelte:component this={DeleteDialog} bind:open={isDeleteDialogOpen} feed={targetFeed} />
    {/await}
    <Tabs.Root value="user" class="m-4 flex-grow">
      <Tabs.List class="*:w-full *:text-lg *:font-light h-12 w-full dark:bg-zinc-800">
        <Tabs.Trigger value="user">User</Tabs.Trigger>
        <Tabs.Trigger value="feeds">Feeds</Tabs.Trigger>
        <Tabs.Trigger value="bookmarks">Bookmarks</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="user">
        <div class="flex flex-col items-start justify-start gap-2">
          <Card.Root class="w-full">
            <Card.Header class="dark:bg-zinc-900">
              <Card.Title>API Token</Card.Title>
            </Card.Header>
            <Card.Content class="p-4">
              <div class="flex items-center gap-2">
                For use in the <a href="https://docs.briefkastenhq.com" alt="Briefkasten Docs">
                  briefkasten extension</a
                >
                you can use the following token:
                <div
                  class="flex items-center justify-between rounded-md p-2 font-mono dark:bg-zinc-700"
                >
                  {$page.data.session?.user?.userId}
                  <Button variant="ghost" class="h-8 p-1">
                    <svg
                      class="size-4"
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
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
          <Card.Root class="w-full">
            <Card.Header class="dark:bg-zinc-900">
              <Card.Title>Import</Card.Title>
            </Card.Header>
            <Card.Content class="p-4">
              <div class="flex items-center gap-2">Import bookmarks</div>
            </Card.Content>
          </Card.Root>
          <Card.Root class="w-full">
            <Card.Header class="dark:bg-zinc-900">
              <Card.Title>Export</Card.Title>
            </Card.Header>
            <Card.Content class="p-4">
              <div class="flex items-center gap-2">Export bookmarks</div>
            </Card.Content>
          </Card.Root>
          <Card.Root class="w-full">
            <Card.Header class="dark:bg-zinc-900">
              <Card.Title>About</Card.Title>
            </Card.Header>
            <Card.Content class="p-4">
              <div class="flex items-center gap-2">About Briefkasten</div>
            </Card.Content>
          </Card.Root>
        </div>
      </Tabs.Content>
      <Tabs.Content value="feeds">
        <div class="flex flex-col items-start justify-start gap-2">
          <Card.Root class="w-full">
            <Card.Header class="dark:bg-zinc-900">
              <Card.Title>Manage Feeds</Card.Title>
            </Card.Header>
            <Card.Content class="p-4">
              <div class="flex flex-col items-start gap-2" role="table">
                <div class="flex w-full items-center justify-start" role="rowheader">
                  <div class="w-64">ID</div>
                  <div class="flex-grow">URL</div>
                  <div class="w-24">Actions</div>
                </div>
                {#each $page.data.feeds.data as feed}
                  <div class="flex w-full items-center justify-start" role="row">
                    <div class="w-64 font-mono" role="cell">
                      {feed.id}
                    </div>
                    <div class="flex-grow truncate font-mono" role="cell">
                      {feed.url}
                    </div>
                    <div class="w-24" role="cell">
                      <Button
                        onclick={(e) => handleToggleDeleteDialog(e, feed)}
                        variant="destructive"
                        class=""
                      >
                        <svg
                          class="size-4 mr-2"
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
                {/each}
              </div>
            </Card.Content>
          </Card.Root>
          <Card.Root class="w-full">
            <Card.Header class="dark:bg-zinc-900">
              <Card.Title>Add Feed</Card.Title>
            </Card.Header>
            <Card.Content class="p-4">
              <form
                action="/settings?/addFeed"
                method="post"
                use:enhance={form_action()}
                class="flex gap-2"
              >
                <input
                  type="text"
                  name="feedUrl"
                  placeholder="RSS Feed URL"
                  class="flex h-10 w-96 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button class={buttonVariants({ variant: "default" })} type="submit"> Add </button>
              </form>
            </Card.Content>
          </Card.Root>
        </div>
      </Tabs.Content>
      <Tabs.Content value="bookmarks">
        <div class="flex flex-col items-start justify-start gap-2">
          <Card.Root class="w-full">
            <Card.Header class="dark:bg-zinc-900">
              <Card.Title>Bookmark Settings</Card.Title>
            </Card.Header>
            <Card.Content class="p-4">
              <div class="flex items-center gap-2">About Briefkasten</div>
            </Card.Content>
          </Card.Root>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</div>
