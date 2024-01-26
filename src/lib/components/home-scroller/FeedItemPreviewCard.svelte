<script lang="ts">
  const { item } = $props<{ item: LoadFeedEntry }>()
</script>

<div class="p-4 rounded-md">
  {item.title}
</div>
