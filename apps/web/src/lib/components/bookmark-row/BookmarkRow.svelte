<script lang="ts">
  import { ofetch } from "ofetch"
  import { format } from "@formkit/tempo"
  import { getContext, type SvelteComponent } from "svelte"
  import BookmarkActions from "./BookmarkActions.svelte"
  import MobileBookmarkActions from "./MobileBookmarkActions.svelte"
  import MediaQuery from "$lib/components/MediaQuery.svelte"
  import { page } from "$app/stores"
  import { Badge } from "$lib/components/ui/badge"
  import { useInterface } from "$state/ui.svelte"
  import { invalidateAll } from "$app/navigation"
  import { Image } from "$lib/components/image"
  import DeleteDialog from "./DeleteDialog.svelte"
  import { cn } from "$lib/utils/style"

  const bookmarkStore = getContext<BookmarkContext>("bookmarks")
  let deleteElement = $state<HTMLDialogElement | null>(null)

  const ui = useInterface()

  const { bookmarkId = $bindable() }: { bookmarkId: string } = $props()

  let bookmark = $state(bookmarkStore.find(bookmarkId)!)

  $effect(() => {
    bookmark = bookmarkStore.find(bookmarkId)!
  })

  let isOptionsOpen = $state(false)

  const handleMetadataSidebarOpen = () => {
    ui.setMetadataSidebarData({
      bookmark,
      categories: $page.data.categories,
      tags: $page.data.tags,
    })
    ui.toggleMetadataSidebar(true)
    ui.toggleMetadataSidebarEditMode(false)
  }

  const handleArchive = async () => {
    await ofetch(`/api/v1/bookmarks`, {
      method: "PUT",
      body: { id: bookmark.id, update: { archived: true } },
    })
    invalidateAll()
  }
</script>

<div
  tabindex={0}
  data-id={bookmark.id}
  role="row"
  class="grid relative gap-4 mx-2 p-4 md:mx-4 rounded-lg rounded-l-none border-l-4 border-transparent transition-all duration-300 outline-none focus:outline-none grid-cols-1 md:grid-cols-[15rem_1fr] dark:focus:bg-neutral-800 focus:border-zinc-500 focus:bg-zinc-100"
  onmouseleave={() => (isOptionsOpen = false)}
  onmouseenter={() => (isOptionsOpen = true)}
>
  <DeleteDialog bind:dialogElement={deleteElement} bookmarkId={bookmark.id} />
  <Image
    thumbhash={bookmark.imageBlur ?? ""}
    src={bookmark.image ?? `https://source.unsplash.com/random/240x144?sig=${bookmark.url}`}
    alt={`${new URL(bookmark.url).hostname} Screenshot`}
    class={cn(
      "w-full md:w-60 h-48 md:h-36 rounded-md border transition md:block border-neutral-100 dark:border-neutral-800",
      ui.userSettings?.compact ? "hidden" : "",
    )}
  />
  <div class="flex flex-col gap-2 relative">
    <span class="text-xl font-semibold pr-6 md:pr-0 line-clamp-1 text-clip" title={bookmark.title}>
      {bookmark.title}
    </span>
    <p class="break-words line-clamp-2 pr-6 md:pr-0">{bookmark.desc}</p>
    <div class="flex gap-2 justify-start items-center text-sm text-muted">
      {#if bookmark.metadata?.logo}
        <img src={bookmark.metadata?.logo} alt="URL Favicon" class="rounded-full size-4" />
      {/if}
      <a
        target="_blank"
        href={bookmark.url}
        class="line-clamp-1 text-clip text-zinc-500 pr-12 md:pr-0"
      >
        {bookmark.url}
      </a>
    </div>
    <span class="flex flex-wrap gap-2">
      <Badge variant="default">
        {format(bookmark.createdAt, { date: "medium", time: "short" })}
      </Badge>
      {#if bookmark.category?.name}
        <Badge variant="secondary">
          {bookmark.category.name}
        </Badge>
      {/if}
      {#if bookmark.tags?.length}
        <span class="flex flex-wrap gap-2">
          {#each bookmark.tags as tag}
            <Badge variant="outline">
              {tag.name}
            </Badge>
          {/each}
        </span>
      {/if}
    </span>
    <MediaQuery query="(max-width: 767px)">
      {#snippet children(matches)}
        {#if matches}
          <MobileBookmarkActions
            url={bookmark.url ?? ""}
            {handleMetadataSidebarOpen}
            handleDeleteDialogOpen={() => deleteElement?.showModal()}
            {handleArchive}
          />
        {:else}
          <BookmarkActions
            url={bookmark.url ?? ""}
            {handleMetadataSidebarOpen}
            handleDeleteDialogOpen={() => deleteElement?.showModal()}
            {isOptionsOpen}
            {handleArchive}
          />
        {/if}
      {/snippet}
    </MediaQuery>
  </div>
</div>
