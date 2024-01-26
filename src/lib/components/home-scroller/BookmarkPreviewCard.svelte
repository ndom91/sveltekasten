<script lang="ts">
  const { item } = $props<{ item: LoadBookmarkResult }>()
</script>

<div class="p-4 rounded-md">
  <img src={item.image} alt={item.title} />
  {item.title}
</div>
