<script lang="ts">
  import { blur } from "svelte/transition"
  import { page } from "$app/stores"
  import { signOut } from "@auth/sveltekit/client"
  import { ModeWatcher, mode, toggleMode } from "mode-watcher"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { Button } from "$lib/components/ui/button"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Popover from "$lib/components/ui/popover";
  import QuickAddForm from "$lib/components/QuickAddForm.svelte"

  let darkMode = $mode === "dark"
  export let formData
</script>

<nav class="*:gap-6 *:flex *:items-center flex w-full items-center justify-between py-8 max-w-7xl mx-auto">
  <ModeWatcher />
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
        <Popover.Content transition={blur}>
          <QuickAddForm form={formData} />
        </Popover.Content>
      </Popover.Root>
      <DropdownMenu.Root loop closeOnItemClick={false}>
        <DropdownMenu.Trigger
          class="rounded-full outline-none focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:ring-offset-white focus:dark:ring-offset-slate-800"
        >
          <Avatar.Root class="rounded-full outline-none focus:outline-none focus:ring-gray-200">
            <Avatar.Image
              src={$page.data.session?.user.image ||
                `https://unavatar.io/${$page.data.session?.user.email}?fallback=https://source.boringavatars.com/marble/120/${$page.data.session?.user.email}?colors=264653r,2a9d8f,e9c46a,f4a261,e76f51`}
              class="rounded focus:outline-none focus:ring-gray-200"
              alt="User Avatar"
            />
            <Avatar.Fallback><Skeleton class="h-full w-full rounded-full" /></Avatar.Fallback>
          </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content transition={blur} transitionConfig={{ delay: 0, duration: 250 }}>
          <DropdownMenu.Group>
            <DropdownMenu.Label class="line-clamp-1 w-full justify-end truncate"
              >{$page.data.session?.user.eame ?? $page.data.session?.user.email}</DropdownMenu.Label
            >
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem
              class="justify-end"
              onCheckedChange={toggleMode}
              bind:checked={darkMode}>Dark Mode</DropdownMenu.CheckboxItem
            >
            <DropdownMenu.Item href="/settings" class="justify-end">User Settings</DropdownMenu.Item
            >
            <DropdownMenu.Separator />
            <DropdownMenu.Item class="justify-end" on:click={() => signOut()}
              >Signout</DropdownMenu.Item
            >
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    {/if}
  </div>
</nav>

<style>
  .active {
    @apply font-bold;
  }
</style>
