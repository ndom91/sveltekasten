<script lang="ts">
  import { Navbar } from "$lib/components/navbar"
  import EmptyState from "$lib/components/EmptyState.svelte"
  import { HomeScroller } from "$lib/components/home-scroller"

  const { data } = $props()

  const handleKeyDown = (e: TODO) => {
    return null
  }
</script>

<svelte:head>
  <title>Briefkasten | Bookmarks</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<Navbar simple />
<div class="flex overflow-y-scroll flex-col">
  <main
    class="h-full align-start flex max-h-[calc(100vh_-_80px)] max-w-[calc(100vw_-_80px)] flex-col justify-start gap-4"
  >
    <div class="flex justify-start px-4 pt-4 w-full">
      <h2 class="text-2xl font-thin">Latest Items</h2>
    </div>
    {#if data.bookmarks}
      <HomeScroller items={data.bookmarks.data} count={data.bookmarks.count} type="bookmarks" />
    {/if}
    {#if data.feedEntries}
      <HomeScroller items={data.feedEntries.data} count={data.feedEntries.count} type="feeds" />
    {/if}
  </main>
</div>

{#snippet emptyHelper()}
  <EmptyState />
  <div class="mx-auto w-1/2 text-center text-muted-foreground">
    Get started by adding a bookmark with the
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
    </svg>
    button above.
    <p>This is where your latest bookmarks and feed items will appear!</p>
  </div>
{/snippet}
