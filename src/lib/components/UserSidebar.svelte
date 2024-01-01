<script lang="ts">
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import { AvatarMenu } from "$lib/components/navbar"
  import { Home, Package, Tags } from "lucide-svelte"
  import Logo from "$lib/assets/Logo.svelte"
  import { cn } from "$lib/utils"
  import { createUI } from "$state/ui.svelte"

  const ui = createUI()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    if (event.code === "BracketLeft") {
      ui.toggleUserSidebar()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<aside
  class={cn(
    "space-between relative flex h-full h-screen flex-grow flex-col bg-white shadow transition-width dark:bg-zinc-900",
    ui.userSidebarOpen ? "w-[clamp(10vw,_20rem,_30vw)]" : "w-24",
  )}
>
  <div class={cn(ui.userSidebarOpen ? "p-6" : "p-6")}>
    <Button size="icon" variant="ghost" on:click={ui.toggleUserSidebar}>
      <Logo class="size-8 text-zinc-50" />
      <span class="sr-only">Toggle navigation menu</span>
    </Button>
    <nav
      class={cn("mt-10 flex flex-col gap-4", ui.userSidebarOpen ? "items-start" : "items-center")}
    >
      <a class="flex items-center gap-2 font-semibold" href="/">
        <Home class="h-6 w-6" />
        {#if ui.userSidebarOpen}
          <span>Home</span>
        {/if}
      </a>
      <a class="flex items-center gap-2 font-semibold" href="/categories">
        <Package class="h-6 w-6" />
        {#if ui.userSidebarOpen}
          <span>Categories</span>
        {/if}
      </a>
      <a class="flex items-center gap-2 font-semibold" href="/tags">
        <Tags class="h-6 w-6" />
        {#if ui.userSidebarOpen}
          <span>Tags</span>
        {/if}
      </a>
    </nav>
  </div>
  <div
    class={cn(
      "absolute bottom-0 mb-4 flex w-full items-center",
      ui.userSidebarOpen ? "justify-start p-6" : "justify-center p-6",
    )}
  >
    <AvatarMenu />
    {#if ui.userSidebarOpen}
      <span class="text-md ml-2 flex items-center justify-start truncate">
        {$page.data.session?.user?.name.split(" ")[0] ?? ""}
      </span>
    {/if}
  </div>
</aside>
