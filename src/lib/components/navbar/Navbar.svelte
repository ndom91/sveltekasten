<script lang="ts">
  import { blur } from "svelte/transition"
  import { page } from "$app/stores"
  import { signOut } from "@auth/sveltekit/client"
  import { Button } from "$lib/components/ui/button"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Popover from "$lib/components/ui/popover";
  import { QuickAddForm, AvatarMenu } from "$lib/components/navbar"

  export let formData
</script>

<nav class="*:gap-6 *:flex *:items-center flex w-full items-center justify-between py-8 max-w-7xl mx-auto px-4">
  <div class="">
    <a class:active={$page.url.pathname === "/"} href="/">Home</a>
    <a class:active={$page.url.pathname === "/tags"} href="/tags">Tags</a>
    <a class:active={$page.url.pathname === "/categories"} href="/categories">Categories</a>
  </div>
  <div class="">
    {#if $page.data.session?.user}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="outline">Quick Add</Button>
        </Popover.Trigger>
        <Popover.Content transition={blur} transitionConfig={{ delay: 0, duration: 250 }} sideOffset={15} alignOffset={15}>
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
