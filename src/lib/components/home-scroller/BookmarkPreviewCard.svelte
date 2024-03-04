<script lang="ts">
  import { format } from "@formkit/tempo"
  const { item } = $props<{ item: LoadBookmark }>()
</script>

<div class="flex flex-col gap-2 p-4 rounded-md max-w-72 bg-neutral-200 dark:bg-neutral-800">
  <img
    src={item.image}
    alt={item.title}
    class="object-cover object-center mb-1 rounded-sm aspect-video"
  />
  <div class="flex flex-col gap-1 w-64">
    <div class="flex justify-between">
      <img
        src={`https://icons.duckduckgo.com/ip9/${new URL(item.url).hostname}.ico`}
        alt="URL Favicon"
        class="rounded-full size-5"
      />
      <span class="dark:text-neutral-400">
        {format(item.createdAt, { date: "medium", time: "short" })}
      </span>
    </div>
    <a href={item.url} target="_blank" class="">
      <span title={item.title}>{item.title}</span>
      <span class="line-clamp-2">{item.desc}</span>
    </a>
  </div>
</div>
