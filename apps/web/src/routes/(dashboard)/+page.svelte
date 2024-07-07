<script lang="ts">
  import { Navbar } from "$lib/components/navbar"
  import { HomeScroller } from "$lib/components/home-scroller"
  import { ScrollerTypes } from "$lib/types"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { onMount } from "svelte"

  onMount(() => {
    // Share Target Redirect
    const sharedSuccess = $page.url.searchParams.get("shared")
    if (sharedSuccess === "true") {
      goto("/")
    }
  })

  type HomeLoadResults = {
    bookmarks: {
      data: LoadBookmark[]
      count: number
    }
    feedEntries: {
      data: LoadFeedEntry[]
      count: number
    }
  }

  const { data }: { data: HomeLoadResults } = $props()
</script>

<svelte:head>
  <title>BriefButler</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Navbar simple />
<main
  class="overflow-y-scroll align-start flex max-w-[100vw] md:max-w-[calc(100vw_-_72px)] flex-col justify-start gap-6"
>
  <div class="flex justify-start px-4 pt-4 w-full">
    <h2 class="text-xl font-thin">Latest Items</h2>
  </div>
  <HomeScroller
    items={data.bookmarks.data}
    count={data.bookmarks.count}
    type={ScrollerTypes.BOOKMARKS}
  />
  <HomeScroller
    items={data.feedEntries.data}
    count={data.feedEntries.count}
    type={ScrollerTypes.FEEDS}
  />
</main>
