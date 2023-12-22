<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte"
  import { page } from "$app/stores"
  import "$lib/styles/style.css"
  import { setContext } from "svelte"
  import { writable } from "svelte/store"

  // Create a writable store
  const openSheetStore = writable(false)
  // $: openSheetStore.set(false)

  setContext("openSheet", openSheetStore)
</script>

<div class="mx-auto max-w-7xl">
  {#if $page.url.pathname !== "/login"}
    <Navbar />
  {/if}
  <slot />
</div>
