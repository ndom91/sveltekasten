<script lang="ts">
  import { page } from "$app/stores"
  import { Toaster } from "svelte-french-toast"
  import { Navbar } from "$lib/components/navbar"
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import MetadataSidebar from "$/lib/components/MetadataSidebar.svelte"

  import "$lib/styles/style.css"
</script>

<div class="flex">
  <Toaster />
  {#if $page.url.pathname !== "/login"}
    <Sidebar />
  {/if}
  <div class="flex w-full flex-grow flex-col">
    <Navbar />
    <slot />
  </div>
  {#if $page.url.pathname !== "/login"}
    <MetadataSidebar />
  {/if}
</div>
