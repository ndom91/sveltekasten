<script lang="ts">
  import { Drawer } from "vaul-svelte"
  import { Button } from "$lib/components/ui/button"
  import Logo from "$lib/assets/Logo.svelte"
  import SidebarContent from "$lib/components/SidebarContent.svelte"
  import { useInterface } from "$state/ui.svelte"

  const ui = useInterface()

  let drawerOpen = $state(false)

  const toggleDrawer = () => {
    drawerOpen = !drawerOpen
  }
</script>

<Drawer.Root direction="left" bind:open={drawerOpen}>
  <button
    onclick={() => (drawerOpen = !drawerOpen)}
    class="flex fixed top-3 left-3 z-20 justify-center items-center size-12"
  >
    <svg
      class="size-6"
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
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      ></path>
    </svg>
  </button>
  <Drawer.Portal>
    <Drawer.Overlay class="fixed inset-0 transition bg-black/40" />
    <Drawer.Content
      class="flex fixed top-0 bottom-0 left-0 z-30 p-2 w-full rounded-r-xl max-w-[300px] bg-neutral-100 dark:bg-neutral-900"
    >
      <div class="flex flex-col w-full h-full">
        <div class="flex justify-start items-center m-4">
          <Button
            class="flex justify-start transition focus:ring-2 focus:outline-none focus:dark:ring-neutral-700"
            size="icon"
            variant="link"
            on:click={ui.toggleUserSidebar}
          >
            <Logo class="!size-10" />
          </Button>
          <span class="mx-auto text-xl font-light opacity-100 transition-all"> BriefButler </span>
        </div>
        <SidebarContent open={true} {toggleDrawer} />
      </div>
      <div class="flex-shrink-0 self-center mx-2 mb-8 w-1.5 h-12 rounded-full bg-neutral-300"></div>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
