<script lang="ts">
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import { MetadataSidebar } from "$/lib/components/metadata-sidebar"
  import { CommandBar } from "$lib/components/command-bar"
</script>

<div class="flex overflow-hidden h-full">
  <CommandBar />
  <Sidebar />
  <div class="flex flex-col min-h-full transition duration-300 translate-x-0 flex-grow-[9]">
    <slot />
  </div>
  <MetadataSidebar />
</div>
