<script lang="ts">
  import { page } from "$app/stores"
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import { MetadataSidebar } from "$/lib/components/metadata-sidebar"
  import { CommandBar } from "$lib/components/command-bar"

  const { children } = $props()

  const DISABLED_PATHS = ["/categories", "/tags", "/settings", "/"]

  const metadataEnabled = $derived(() => !DISABLED_PATHS.includes($page.url.pathname))
  // data-vaul-drawer-wrapper
</script>

<div class="flex overflow-hidden h-full">
  <CommandBar />
  <Sidebar />
  <div class="flex flex-col min-h-full transition duration-300 translate-x-0 flex-grow-[9]">
    {@render children()}
  </div>
  {#if metadataEnabled()}
    <MetadataSidebar />
  {/if}
</div>
