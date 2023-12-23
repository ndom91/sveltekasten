<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  
  export let bookmark
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{bookmark.title}</Card.Title>
    <Card.Description>{bookmark.desc}</Card.Description>
  </Card.Header>
  <Card.Content>
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
