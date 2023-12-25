<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import type { Bookmark } from "$lib/types"
  import { ActionButton } from "$lib/components/bookmark-card"
  import { Trash } from "lucide-svelte"

  export let bookmark: Bookmark
  // console.log("bookmark", bookmark)
</script>

<Card.Root
  class={`flex flex-col bg-gradient-to-b to-current from-[${
    bookmark.metadata?.logo?.background_color.toLowerCase() || "#ccc"
  }]`}
>
  <Card.Header class="adaptive-glass">
    <div class="">
      <Card.Title class="flex items-center justify-between">
        <span>
          {bookmark.title}
        </span>
        <ActionButton class="size-10">
          <Trash />
        </ActionButton>
      </Card.Title>
      <Card.Description class="line-clamp-2">{bookmark.desc}</Card.Description>
    </div>
  </Card.Header>
  <Card.Content class="flex-grow">
    <div class="relative flex">
      <img
        src={bookmark.image}
        alt="Bookmark Screenshot"
        class="aspect-video rounded-md object-cover"
      />
    </div>
  </Card.Content>
  <Card.Footer>
    <p>{bookmark.url}</p>
  </Card.Footer>
</Card.Root>

<style>
  .adaptive-glass {
    --glass-lightness: 100%;
    background: hsl(0 0% var(--glass-lightness) / 50%);
    backdrop-filter: blur(40px);
    @media (prefers-color-scheme: dark) {
      --glass-lightness: 0%;
    }
  }
</style>
