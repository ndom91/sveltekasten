<script lang="ts">
  import { format } from "@formkit/tempo"

  const { item }: { item: LoadBookmark } = $props()
</script>

<div
  id="dashboard-bookmark-row"
  class="flex flex-col gap-2 p-4 rounded-md h-fit snap-start max-w-72 bg-neutral-200 dark:bg-neutral-800"
>
  <a href={item.url} target="_blank" class="">
    <img
      src={item.image}
      alt={item.title}
      class="w-64 mb-1 rounded-sm object-top object-cover bg-neutral-800 dark:bg-white aspect-video"
    />
  </a>
  <div class="flex flex-col gap-1 w-64">
    <div class="flex justify-between">
      <img
        src={`https://favicon.yandex.net/favicon/${new URL(item.url).hostname}`}
        alt="URL Favicon"
        class="rounded-full size-5"
      />
      <span class="dark:text-neutral-400">
        {format(item.createdAt, { date: "medium", time: "short" })}
      </span>
    </div>
    <a
      href={item.url}
      target="_blank"
      class="transition focus:underline focus:outline-none focus:outline-offset-2"
    >
      <span class="line-clamp-2" title={item.title}>{item.title} - {item.desc}</span>
    </a>
  </div>
</div>
