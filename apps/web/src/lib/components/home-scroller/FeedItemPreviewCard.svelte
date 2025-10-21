<script lang="ts">
import { format } from "@formkit/tempo"
import { Button } from "$lib/components/ui/button"
import * as Tooltip from "$lib/components/ui/tooltip"
import { invalidateAll } from "$app/navigation"
import { PUBLIC_WORKER_URL } from "$env/static/public"

const { item }: { item: LoadFeedEntry } = $props()

const handleMarkAsRead = async () => {
  const feedEntry = {
    ...item,
    unread: false,
  }
  await fetch("/api/v1/feeds", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedEntry }),
  })
  await invalidateAll()
}

const imageUrl = $derived.by(() => {
  if (item.feedMedia?.[0]?.href) {
    return `${PUBLIC_WORKER_URL}/img/s_256x144/${item.feedMedia[0].href}`
  } else {
    return `${PUBLIC_WORKER_URL}/img/_/https://picsum.photos/seed/${btoa(item.link).substring(item.link.length - 32, item.link.length)}/256/144.webp`
  }
})
</script>

<div
  id="dashboard-feed-row"
  class="max-w-72 group relative flex snap-start flex-col gap-2 rounded-md bg-neutral-200 p-4 dark:bg-neutral-800"
>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
      <Button
        class="absolute right-4 top-4 rounded-full border border-gray-300/40 border-neutral-100 bg-neutral-50 p-2 opacity-0 shadow-[0_4px_20px_rgba(0,0,0,0.1)] backdrop-blur-[6px] transition duration-300 ease-in-out focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-0 group-hover:opacity-100 dark:border-gray-600/10 dark:border-neutral-800 dark:bg-neutral-900/50 dark:bg-neutral-950 focus:dark:ring-neutral-700"
        builders={[tooltipBuilder]}
        variant="ghost"
        size="icon"
        on:click={handleMarkAsRead}
      >
        <svg
          class="size-5 text-neutral-900 group-hover:animate-(--animation-shake-z) dark:text-neutral-100"
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
            d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
          ></path>
        </svg>
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>Mark as Read</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <img
    src={imageUrl}
    alt={item.title}
    class="mb-1 aspect-video rounded-sm object-cover object-center"
  />
  <div class="flex w-64 flex-col gap-1 overflow-hidden">
    <div class="flex justify-between">
      <img
        src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(item.link).hostname}`}
        alt="URL Favicon"
        class="size-5 rounded-full"
      />
      <span class="dark:text-neutral-400">
        {format(item.published instanceof Date ? item.published : new Date(), {
          date: "medium",
          time: "short",
        })}
      </span>
    </div>
    <a
      href={item.link}
      target="_blank"
      class="line-clamp-2 transition focus:underline focus:outline-none focus:outline-offset-2"
      title={item.title}
    >
      {item.title}
    </a>
  </div>
</div>
