<script lang="ts">
  import { Navbar } from "$lib/components/navbar"
  import EmptyIllustration from "$lib/assets/new.png"
  import { HomeScroller } from "$lib/components/home-scroller"
  import { ScrollerTypes } from "$lib/types"

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
  <title>Briefkasten | Bookmarks</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<Navbar simple />
<main
  class="h-full overflow-y-scroll align-start flex max-h-[calc(100vh_-_80px)] max-w-[calc(100vw_-_72px)] flex-col justify-start gap-6"
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

{#snippet emptyHelper()}
  <img src={EmptyIllustration} alt="Empty" class="w-full max-w-xl grayscale dark:invert" />
  <div class="flex flex-col justify-center items-center mx-auto w-1/2 text-muted-foreground">
    <p>This is where your latest bookmarks and feed items will appear!</p>
    <p>
      Get started adding a bookmark by dragging a URL onto the app, using the <a
        class="underline underline-offset-4"
        href="https://github.com/ndom91/briefkasten-extension"
        target="_blank">Browser Extension</a
      >
      or using the Quick Add button (
      <svg
        class="inline p-1 rounded-md size-7 dark:bg-zinc-700"
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
          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
        ></path>
      </svg>) in the navbar on the
      <a class="underline underline-offset-4" href="/bookmarks">Bookmarks</a> page.
    </p>
  </div>
{/snippet}
