<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import type { Bookmark } from "$lib/types"

  export let bookmark: Bookmark
  // console.log("bookmark", bookmark)
</script>

<Card.Root
  class={`flex flex-col bg-gradient-to-b from-[${
    bookmark.metadata?.logo?.background_color.toLowerCase() || "#ccc"
  }]`}
>
  <Card.Header>
    <Card.Title>{bookmark.title}</Card.Title>
    <Card.Description class="line-clamp-2">{bookmark.desc}</Card.Description>
  </Card.Header>
  <Card.Content class="flex-grow">
    <img src={bookmark.image} alt="Bookmark Screenshot" class="aspect-video object-fill" />
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
