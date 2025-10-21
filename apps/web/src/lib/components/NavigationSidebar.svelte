<script lang="ts">
import { watch } from "runed"
import Logo from "$lib/assets/Logo.svelte"
import SidebarContent from "$lib/components/SidebarContent.svelte"
import Drawer from "$lib/components/mobile/Drawer.svelte"
import { Button } from "$lib/components/ui/button"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"

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
    if (document.startViewTransition) {
      document.startViewTransition(() => mutate())
    } else {
      mutate()
    }
  }
)

let windowWidth: number = $state(1000)
</script>

<svelte:window onkeydown={handleKeyDown} bind:innerWidth={windowWidth} />

{#if windowWidth < 768}
  <Drawer />
{:else}
  <aside
    bind:this={userSidebarElement}
    class="flex h-full flex-col justify-start border-r border-r-neutral-200 bg-neutral-50 transition-all duration-100 dark:border-r-neutral-800/60 dark:bg-neutral-900"
  >
    <div class="m-4 flex items-center justify-center">
      <Button
        class="flex justify-start transition focus:outline-none"
        size="icon"
        variant="link"
        onclick={ui.toggleUserSidebar}
      >
        <Logo class="size-10!" />
      </Button>
      <span
        class={cn(
          "transition-all text-xl font-light mx-auto",
          ui.userSidebarOpen ? "opacity-100" : "hidden",
        )}
      >
        BriefButler
      </span>
    </div>
    <SidebarContent />
  </aside>
{/if}
