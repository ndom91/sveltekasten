<script lang="ts">
  import { format } from "@formkit/tempo"
  import { PUBLIC_WORKER_URL } from "$env/static/public"

  const { item }: { item: LoadBookmarkFlatTags } = $props()

  const imageUrl = `${PUBLIC_WORKER_URL}/img/s_256x144/${item.image}`
  // $derived.by(() => {
  //   if (item.image) {
  //     return `${PUBLIC_WORKER_URL}/img/s_256x144/${item.image}`
  //   } else {
  //     return `${PUBLIC_WORKER_URL}/img/_/https://picsum.photos/seed/${Math.random() * 100000}/256/144.webp`
  //   }
  // })

  const createdDate = $derived(format(item.createdAt, { date: "medium", time: "short" }))
</script>

<div
  id="dashboard-bookmark-row"
  class="max-w-72 flex h-fit snap-start flex-col gap-2 rounded-md bg-neutral-200 p-4 dark:bg-neutral-800"
>
  <a href={item.url} target="_blank" class="">
    <img
      src={imageUrl}
      alt={item.title}
      class="mb-1 aspect-video w-64 rounded-sm bg-neutral-800 object-cover object-top dark:bg-white"
    />
  </a>
  <div class="flex w-64 flex-col gap-1">
    <div class="flex justify-between">
      <img
        src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(item.url).hostname}`}
        alt="URL Favicon"
        class="size-5 rounded-full"
      />
      <span class="dark:text-neutral-400">
        {createdDate}
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
