<script lang="ts">
import { onMount } from "svelte"
import { goto } from "$app/navigation"
import { page } from "$app/stores"
import { HomeScroller } from "$lib/components/home-scroller"
import { Navbar } from "$lib/components/navbar"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { FeedEntriesService } from "$lib/state/feedEntries.svelte"
import { ScrollerTypes } from "$lib/types"
import { getContext } from "$lib/utils/context"

onMount(async () => {
  // Share Target Redirect
  const sharedSuccess = $page.url.searchParams.get("shared")
  if (sharedSuccess === "true") {
    await goto("/")
  }
})

const bookmarkService = getContext(BookmarksService)
const feedEntriesService = getContext(FeedEntriesService)

// $effect(() => {
//   bookmarkService.bookmarks = $page.data.bookmarks.data
// })
</script>

<svelte:head>
  <title>BriefButler</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Navbar showSearch={false} showQuickAdd={false} showSidebar={false} />
<main class="align-start flex flex-col justify-start gap-6 overflow-y-scroll py-4">
  <HomeScroller
    items={bookmarkService.bookmarks}
    count={bookmarkService.bookmarks.length}
    type={ScrollerTypes.BOOKMARKS}
  />
  <HomeScroller
    items={feedEntriesService.feedEntries}
    count={feedEntriesService.feedEntries.length}
    type={ScrollerTypes.FEEDS}
  />
</main>
