<script lang="ts">
  import { Navbar } from "$lib/components/navbar"
  import { HomeScroller } from "$lib/components/home-scroller"
  import { ScrollerTypes } from "$lib/types"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import { getContext } from "svelte"

  onMount(() => {
    // Share Target Redirect
    const sharedSuccess = $page.url.searchParams.get("shared")
    if (sharedSuccess === "true") {
      goto("/")
    }
  })

  const bookmarkService = getContext<BookmarkContext>("bookmarks")

  $effect(() => {
    bookmarkService.bookmarks = $page.data.bookmarks.data
  })
</script>

<svelte:head>
  <title>BriefButler</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Navbar showSearch={false} showQuickAdd={false} showSidebar={false} />
<main class="overflow-y-scroll py-4 align-start flex flex-col justify-start gap-6">
  <HomeScroller
    items={bookmarkService.bookmarks}
    count={$page.data.bookmarks.count}
    type={ScrollerTypes.BOOKMARKS}
  />
  <HomeScroller
    items={$page.data.feedEntries.data}
    count={$page.data.feedEntries.count}
    type={ScrollerTypes.FEEDS}
  />
</main>
