<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { Button } from "$lib/components/ui/button"
  import { format } from "@formkit/tempo"
  import { invalidateAll } from "$app/navigation"

  const { item } = $props<{ item: LoadFeedEntry }>()

  const handleMarkAsRead = async () => {
    const feedEntry = {
      ...item,
      unread: false,
    }
    await fetch(`/api/v1/feeds`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedEntry }),
    })
    invalidateAll()
  }
</script>

<div
  class="flex relative flex-col gap-2 p-4 rounded-md snap-start group max-w-72 bg-neutral-200 dark:bg-neutral-800"
>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
      <Button
        class="absolute top-4 right-4 p-2 rounded-full border opacity-0 transition duration-200 ease-in-out group-hover:opacity-100 bg-neutral-50 border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800"
        builders={[tooltipBuilder]}
        variant="ghost"
        size="icon"
        on:click={handleMarkAsRead}
      >
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
    src={item.feedMedia?.[0]?.href ??
      `https://picsum.photos/seed/${encodeURIComponent(
        item.title.replaceAll(" ", "").substring(0, 5).toLowerCase(),
      )}/240/153.webp`}
    alt={item.title}
    class="object-cover object-center mb-1 rounded-sm aspect-video"
  />
  <div class="flex flex-col gap-1 w-64">
    <div class="flex justify-between">
      <img
        src={`https://icons.duckduckgo.com/ip9/${new URL(item.link).hostname}.ico`}
        alt="URL Favicon"
        class="rounded-full size-5"
      />
      <span class="dark:text-neutral-400">
        {format(item.published!, { date: "medium", time: "short" })}
      </span>
    </div>
    <a href={item.link} target="_blank" class="line-clamp-2" title={item.title}>
      {item.title}
    </a>
  </div>
</div>
