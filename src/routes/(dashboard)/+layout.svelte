<script lang="ts">
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import { MetadataSidebar } from "$/lib/components/metadata-sidebar"
  import { CommandBar } from "$lib/components/command-bar"
</script>

<div class="flex overflow-hidden">
  <CommandBar />
  <Sidebar />
  <div class="flex flex-col w-full">
    <slot />
  </div>
  <MetadataSidebar />
</div>
