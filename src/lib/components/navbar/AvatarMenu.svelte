<script lang="ts">
  import { page } from "$app/stores"
  import { blur } from "svelte/transition"
  import { signOut } from "@auth/sveltekit/client"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { ModeWatcher, mode, toggleMode } from "mode-watcher"

  let isDarkMode = $derived($mode === "dark")
</script>

<ModeWatcher />
<DropdownMenu.Root closeOnItemClick={false}>
  <DropdownMenu.Trigger
    class="rounded-full outline-none transition duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500"
  >
    <Avatar.Root>
      <Avatar.Image
        src={$page.data.session?.user.image ||
          `https://unavatar.io/${$page.data.session?.user.email}?fallback=https://source.boringavatars.com/marble/120/${$page.data.session?.user.email}?colors=264653r,2a9d8f,e9c46a,f4a261,e76f51`}
        class="rounded"
        alt="User Avatar"
      />
      <Avatar.Fallback><Skeleton class="h-full w-full rounded-full" /></Avatar.Fallback>
    </Avatar.Root>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content transition={blur} transitionConfig={{ delay: 0, duration: 250 }}>
    <DropdownMenu.Group>
      <DropdownMenu.Label class="line-clamp-1 w-full justify-start truncate">
        {$page.data.session?.user.name ?? $page.data.session?.user.email}
      </DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem
        class="justify-start hover:cursor-pointer"
        onCheckedChange={toggleMode}
        checked={isDarkMode}
      >
        Dark Mode
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.Item href="/settings" class="justify-start hover:cursor-pointer"
        >User Settings</DropdownMenu.Item
      >
      <DropdownMenu.Separator />
      <DropdownMenu.Item class="justify-start hover:cursor-pointer" on:click={() => signOut()}
        >Signout</DropdownMenu.Item
      >
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
