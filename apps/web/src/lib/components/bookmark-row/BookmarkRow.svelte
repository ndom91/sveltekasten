<script lang="ts">
  import { format } from "@formkit/tempo"
  import BookmarkActions from "./BookmarkActions.svelte"
  import DeleteDialog from "./DeleteDialog.svelte"
  import MobileBookmarkActions from "./MobileBookmarkActions.svelte"
  import MediaQuery from "$lib/components/MediaQuery.svelte"
  import { Image } from "$lib/components/image"
  import { Badge } from "$lib/components/ui/badge"
  import { useInterface } from "$lib/state/ui.svelte"
  import type { Category } from "$lib/types/zod"
  import { invalidateAll } from "$app/navigation"
  import { page } from "$app/stores"
  import { PUBLIC_WORKER_URL } from "$env/static/public"

  type CategoryVisible = Category & { visible: boolean }

  let deleteElement = $state<HTMLDialogElement>()

  const ui = useInterface()

  const { bookmark = $bindable() }: { bookmark: LoadBookmarkFlatTags } = $props()

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
    await fetch(`/api/v1/bookmarks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bookmark.id,
        update: { archived: true },
      }),
    })
    await invalidateAll()
  }

  const categories = $state($page.data.categories)
  let isBookmarkCategoryHidden = $state(false)

  const imageUrl = $derived.by(() => {
    if (bookmark.image) {
      return `${PUBLIC_WORKER_URL}/img/s_260x144/${bookmark.image}`
    } else {
      return `${PUBLIC_WORKER_URL}/img/s_260x144/https://source.unsplash.com/random/240x144?sig=${bookmark.url}`
    }
  })

  $effect(() => {
    isBookmarkCategoryHidden = !!categories
      .filter((cat: CategoryVisible) => cat.visible === false)
      .find((cat: CategoryVisible) => cat.id === bookmark?.category?.id)
  })
</script>

<div
  tabindex={0}
  data-id={bookmark.id}
  role="row"
  class="bookmark-row relative mx-2 flex max-w-full gap-4 rounded-lg rounded-l-none border-l-4 border-transparent p-4 outline-none transition-all duration-500 ease-[var(--ease-spring-3)] focus:border-zinc-500 focus:bg-neutral-100 dark:focus:bg-neutral-800/40 md:mx-4"
  class:hidden={isBookmarkCategoryHidden}
  onpointerleave={() => (isOptionsOpen = false)}
  onpointerenter={() => (isOptionsOpen = true)}
>
  <DeleteDialog bind:dialogElement={deleteElement} bookmarkId={bookmark.id} />
  <Image
    thumbhash={bookmark.imageBlur ?? ""}
    src={imageUrl}
    alt={`${new URL(bookmark.url).hostname} Screenshot`}
    class={ui.userSettings?.compact ? "hidden" : ""}
  />
  <div class="relative flex w-full flex-col gap-2 truncate">
    <span class="truncate pr-10 text-xl font-semibold md:pr-0" title={bookmark.title}>
      {bookmark.title}
    </span>
    <p class="line-clamp-2 pr-10 md:pr-0">{bookmark.desc}</p>
    <div class="text-muted flex items-center justify-start gap-2 text-sm">
      <img
        src={`https://favicon.im/${new URL(bookmark.url).hostname}`}
        alt="URL Favicon"
        class="size-4 rounded-full"
      />
      <a
        target="_blank"
        href={bookmark.url}
        class="line-clamp-1 text-clip pr-8 text-neutral-500 md:pr-0"
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

<style>
  .bookmark-row {
    @starting-style {
      @apply -translate-y-2 opacity-0;
    }
  }
</style>
