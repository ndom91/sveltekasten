<script lang="ts">
  import { Navbar } from "$lib/components/navbar"
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import MetadataSidebar from "$/lib/components/MetadataSidebar.svelte"
  import { CommandBar } from "$lib/components/command-bar"

  import "$lib/styles/style.css"
</script>

<div class="flex">
  <CommandBar />
  <Sidebar />
  <div class="flex w-full flex-grow flex-col">
    <Navbar />
    <slot />
  </div>
  <MetadataSidebar />
</div>
