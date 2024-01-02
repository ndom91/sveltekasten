<script lang="ts">
  import { page } from "$app/stores"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { Button } from "$lib/components/ui/button"
  import { AvatarMenu } from "$lib/components/navbar"
  import { Home, Package, Tags } from "lucide-svelte"
  import Logo from "$lib/assets/Logo.svelte"
  import { cn } from "$lib/utils"
  import { useInterface } from "$state/ui.svelte"

  const ui = useInterface()

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
    "space-between relative flex h-screen flex-grow flex-col border-r bg-white shadow transition-width dark:border-r-zinc-800 dark:bg-zinc-900",
    ui.userSidebarOpen ? "w-[clamp(10vw,_20rem,_30vw)]" : "w-20",
  )}
>
  <div class="p-4">
    <Button class="mx-auto" size="icon" variant="ghost" on:click={ui.toggleUserSidebar}>
      <Logo class="size-8 text-zinc-800 dark:text-zinc-50" />
      <span class="sr-only">Toggle navigation menu</span>
    </Button>
    <div
      class={cn(
        "mx-auto my-4 w-2/3 rounded-full border-b-2 border-zinc-100 dark:border-zinc-800",
        ui.userSidebarOpen ? "mx-0 w-full" : "",
      )}
    />
    <nav
      class={cn(
        "mt-6 flex flex-col gap-6",
        ui.userSidebarOpen ? "items-start pl-2" : "items-center",
      )}
    >
      <a class="flex items-center gap-2 font-semibold" href="/dashboard">
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Home class="h-6 w-6" />
          </Tooltip.Trigger>
          <Tooltip.Content side="right">
            <p>Dashboard</p>
          </Tooltip.Content>
        </Tooltip.Root>
        {#if ui.userSidebarOpen}
          <span>Home</span>
        {/if}
      </a>
      <a class="flex items-center gap-2 font-semibold" href="/categories">
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Package class="h-6 w-6" />
          </Tooltip.Trigger>
          <Tooltip.Content side="right">
            <p>Categories</p>
          </Tooltip.Content>
        </Tooltip.Root>
        {#if ui.userSidebarOpen}
          <span>Categories</span>
        {/if}
      </a>
      <a class="flex items-center gap-2 font-semibold" href="/tags">
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Tags class="h-6 w-6" />
          </Tooltip.Trigger>
          <Tooltip.Content side="right">
            <p>Tags</p>
          </Tooltip.Content>
        </Tooltip.Root>
        {#if ui.userSidebarOpen}
          <span>Tags</span>
        {/if}
      </a>
    </nav>
  </div>
  <div
    class={cn(
      "absolute bottom-0 mb-4 flex w-full flex-col justify-center",
      ui.userSidebarOpen ? "items-start p-4" : "items-center p-4",
    )}
  >
    <div
      class={cn(
        "mx-auto my-4 w-2/3 rounded-full border-b-2 border-zinc-100 dark:border-zinc-800",
        ui.userSidebarOpen ? "mx-0 w-full" : "",
      )}
    />
    <div class="flex">
      <AvatarMenu />
      {#if ui.userSidebarOpen}
        <span class="text-md ml-4 flex items-center justify-start truncate">
          {$page.data.session?.user?.name ?? ""}
        </span>
      {/if}
    </div>
  </div>
</aside>
