<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte"
  import { page } from "$app/stores"
  import "$lib/styles/style.css"
</script>

{#if $page.url.pathname !== "/login"}
  <Sidebar />
{/if}
<slot />
