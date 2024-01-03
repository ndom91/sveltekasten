<script lang="ts">
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import { Navbar } from "$lib/components/navbar"
  import { CommandBar } from "$lib/components/command-bar"
</script>

<div class="flex">
  <CommandBar />
  <Sidebar />
  <div class="flex w-full flex-grow flex-col">
    <Navbar simple={true} />
    <slot />
  </div>
</div>
