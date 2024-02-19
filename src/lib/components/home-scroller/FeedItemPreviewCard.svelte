<script lang="ts">
  import { format } from "date-fns"
  const { item } = $props<{ item: LoadFeedEntry }>()
</script>

<div class="flex flex-col gap-2 p-4 m-4 rounded-md max-w-72 bg-neutral-200 dark:bg-neutral-800">
  <img
    src={item.feedMedia?.[0]?.href ??
      `https://picsum.photos/seed/${encodeURIComponent(
        item.title.replaceAll(" ", "").substring(0, 5).toLowerCase(),
      )}/240/153.webp`}
    alt={item.title}
    class="mb-1 rounded-sm aspect-video"
  />
  <div class="flex flex-col gap-1 w-64 line-clamp-2">
    <div class="flex justify-between">
      <img
        src={`https://icons.duckduckgo.com/ip9/${new URL(item.link).hostname}.ico`}
        alt="URL Favicon"
        class="rounded-full size-5"
      />
      <span class="dark:text-neutral-400">
        {format(item.published, "H:mm d MMM yyyy")}
      </span>
    </div>
    <a href={item.link} target="_blank" class="line-clamp-2">
      {item.title}
    </a>
  </div>
</div>
