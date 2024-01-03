<script lang="ts">
  import { page } from "$app/stores"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { Button } from "$lib/components/ui/button"
  import { AvatarMenu } from "$lib/components/navbar"
  import Logo from "$lib/assets/Logo.svelte"
  import { cn } from "$lib/utils"
  import { useInterface } from "$state/ui.svelte"

  const ui = useInterface()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) return
    if (event.code === "BracketLeft") {
      ui.toggleUserSidebar()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<aside
  class={cn(
    "space-between relative flex h-screen flex-grow flex-col border-r bg-zinc-50 transition-width dark:border-r-zinc-800 dark:bg-zinc-900",
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
        "mt-6 flex flex-col gap-2",
        ui.userSidebarOpen ? "items-start pl-2" : "items-center",
      )}
    >
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
          <Button
            variant="ghost"
            builders={[tooltipBuilder]}
            class="relative flex items-center rounded-md border-0 p-2 font-semibold outline-none transition duration-300 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-0 dark:focus:ring-zinc-800"
            href="/dashboard"
          >
            <svg
              class="size-6"
              aria-label="home"
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              ></path>
            </svg>
            {#if ui.userSidebarOpen}
              <span class="ml-4 text-lg font-normal">Home</span>
            {/if}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">
          <p>Dashboard</p>
        </Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
          <Button
            variant="ghost"
            builders={[tooltipBuilder]}
            class="relative flex items-center rounded-md border-0 p-2 font-semibold outline-none transition duration-300 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-0 dark:focus:ring-zinc-800"
            href="/dashboard/categories"
          >
            <svg
              class="size-6"
              data-slot="icon"
              aria-label="package"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
              ></path>
            </svg>
            {#if ui.userSidebarOpen}
              <span class="ml-4 text-lg font-normal">Categories</span>
            {/if}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">
          <p>Categories</p>
        </Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder={tooltipBuilder} class="outline-none">
          <Button
            variant="ghost"
            builders={[tooltipBuilder]}
            class="relative flex items-center rounded-md border-0 p-2 font-semibold outline-none transition duration-300 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-0 dark:focus:ring-zinc-800"
            href="/dashboard/tags"
          >
            <svg
              class="size-6"
              data-slot="icon"
              fill="none"
              aria-label="tag"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
              ></path>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"></path>
            </svg>
            {#if ui.userSidebarOpen}
              <span class="ml-4 text-lg font-normal">Tags</span>
            {/if}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">
          <p>Tags</p>
        </Tooltip.Content>
      </Tooltip.Root>
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
