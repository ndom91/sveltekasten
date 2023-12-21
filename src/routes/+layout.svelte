<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte"
  import "$lib/styles/style.css"
</script>

<div class="px-8">
  <Sidebar />
  <slot />
</div>
