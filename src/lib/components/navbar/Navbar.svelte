<script lang="ts">
  import { blur } from "svelte/transition"
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import type { PageData } from "./$types"
  import * as Popover from "$lib/components/ui/popover"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { QuickAddForm, AvatarMenu } from "$lib/components/navbar"
  import { Plus } from "lucide-svelte"

  export let formData: PageData.form

  let open = false

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    if (event.altKey && event.code === "KeyN") {
      open = !open
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<nav
  class="*:gap-6 *:flex *:items-center mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-8"
>
  <div class="">
    <a class:active={$page.url.pathname === "/"} href="/">Home</a>
    <a class:active={$page.url.pathname === "/tags"} href="/tags">Tags</a>
    <a class:active={$page.url.pathname === "/categories"} href="/categories">Categories</a>
  </div>
  <div class="">
    {#if $page.data.session?.user}
      <Popover.Root {open}>
        <Popover.Trigger tabindex={-1}>
          <Tooltip.Root>
            <Tooltip.Trigger tabindex={-1}>
              <Button variant="outline" class="size-11 rounded-full p-0">
                <Plus class="size-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Quick add Bookmark</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Popover.Trigger>
        <Popover.Content
          transition={blur}
          transitionConfig={{ delay: 0, duration: 250 }}
          sideOffset={15}
          alignOffset={15}
        >
          <QuickAddForm form={formData} />
        </Popover.Content>
      </Popover.Root>
      <AvatarMenu />
    {/if}
  </div>
</nav>

<style>
  .active {
    @apply font-bold;
  }
</style>
