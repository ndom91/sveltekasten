<script lang="ts">
  import { format } from "date-fns"
  const { item } = $props<{ item: LoadBookmarkResult }>()
</script>

<div class="flex flex-col gap-2 p-4 m-4 rounded-md max-w-72 bg-zinc-800">
  <img src={item.image} alt={item.title} class="rounded-sm aspect-video" />
  <div class="max-w-full truncate">
    <div class="flex justify-between">
      <img
        src={`https://icons.duckduckgo.com/ip9/${new URL(item.url).hostname}.ico`}
        alt="URL Favicon"
        class="rounded-full size-5"
      />
      <span class="dark:text-neutral-400">
        {format(item.createdAt, "H:mm d MMM yyyy")}
      </span>
    </div>
    <a href={item.url} target="_blank" class="line-clamp-2">
      {item.title} - {item.desc}
    </a>
  </div>
</div>
