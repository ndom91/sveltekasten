<script lang="ts">
  import { page } from "$app/stores"
  import { ofetch } from "ofetch"
  import { Badge } from "$lib/components/ui/badge"
  import { Button } from "$lib/components/ui/button"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { useInterface } from "$state/ui.svelte"
  import type { PageServerLoad } from "./$types"
  import type { Feed } from "$lib/types/zod"

  const ui = useInterface()

  const { data: feeds } = $page.data.feeds as PageServerLoad.feeds.data

  const handleMarkAllRead = async (feed: Feed) => {
    await ofetch("/api/v1/feeds/mark-all-read", {
      method: "POST",
      body: {
        feedId: feed.id,
      },
    })
  }
</script>

<div class="flex gap-4 justify-start items-center h-full">
  <div class="flex flex-col gap-4 p-6 h-full">
    <div class="flex justify-between items-center">
      <h2>Filters</h2>
    </div>
    <div class="grid gap-y-4 justify-start grid-cols-[30px_1fr]">
      <div class="flex justify-center items-start pt-1">
        <Checkbox id="unread-only" bind:checked={ui.showUnreadOnly} />
      </div>
      <label for="unread-only" class="flex flex-col gap-2 items-start">Unread Only</label>
    </div>
    <div class="grid gap-y-4 justify-start grid-cols-[30px_1fr]">
      {#each feeds as feed}
        <div class="flex justify-center items-start pt-1">
          <Checkbox id={new URL(feed.url).host} bind:checked={feed.visible} />
        </div>
        <div class="flex flex-col gap-2 items-start">
          <label for={new URL(feed.url).host} class="flex gap-2 justify-start items-center">
            <span> {new URL(feed.url).host} </span>
            <img
              src={`https://icons.duckduckgo.com/ip9/${new URL(feed.url).hostname}.ico`}
              alt="URL Favicon"
              class="rounded-full size-6"
            />
          </label>
          <div class="line-clamp-2 dark:text-zinc-600">
            {feed.description}
          </div>
          <div class="flex gap-2 justify-start items-center">
            <Badge variant="outline" title="Unread" class="py-0 px-2 h-8">
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
                  d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                ></path>
              </svg>
              {feed["_count"].feedEntries ?? 0}
            </Badge>
            <Button
              onclick={() => handleMarkAllRead(feed)}
              class="py-0 px-2 h-8 text-xs rounded-full"
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
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                ></path>
              </svg>
              Mark All Read
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
