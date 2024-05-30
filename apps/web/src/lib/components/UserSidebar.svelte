<script lang="ts">
  import { watch } from "runed"
  import Drawer from "$lib/components/mobile/Drawer.svelte"
  import SidebarContent from "$lib/components/SidebarContent.svelte"
  import { Button } from "$lib/components/ui/button"
  import Logo from "$lib/assets/Logo.svelte"
  import { cn } from "$lib/utils/style"
  import { useInterface } from "$state/ui.svelte"

  const ui = useInterface()
  let userSidebarElement = $state<HTMLElement>()!

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.target instanceof HTMLInputElement) {
      return
    }
    if (event.code === "BracketLeft") {
      ui.toggleUserSidebar()
    }
  }

  const mutate = () => {
    if (ui.userSidebarOpen) {
      userSidebarElement.style.minWidth = "210px"
    } else {
      userSidebarElement.style.minWidth = "72px"
    }
  }

  watch.pre(
    () => ui.userSidebarOpen,
    () => {
      // @ts-expect-error
      document.startViewTransition ? document.startViewTransition(() => mutate()) : mutate()
    },
  )

  let windowWidth: number = $state(1000)
</script>

<svelte:window onkeydown={handleKeyDown} bind:innerWidth={windowWidth} />

{#if windowWidth < 768}
  <Drawer />
{:else}
  <aside
    bind:this={userSidebarElement}
    class={cn(
      "space-between flex h-full flex-col border-r bg-neutral-50 transition-all border-r-neutral-200 dark:border-r-neutral-900 dark:bg-neutral-900 duration-100 w-[72px] justify-start",
    )}
  >
    <div class="flex justify-start items-center m-4">
      <Button
        class="flex justify-start transition focus:ring-2 focus:outline-none focus:dark:ring-neutral-700"
        size="icon"
        variant="link"
        on:click={ui.toggleUserSidebar}
      >
        <Logo class="!size-10" />
      </Button>
      <span
        class={cn(
          "transition-all text-xl font-light mx-auto",
          ui.userSidebarOpen ? "opacity-100" : "opacity-0 duration-0 pointer-events-none w-0",
        )}
      >
        BriefButler
      </span>
    </div>
    <SidebarContent />
  </aside>
{/if}
