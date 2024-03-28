<script lang="ts">
  import { page } from "$app/stores"
  import { blur } from "svelte/transition"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { ModeWatcher, mode, toggleMode } from "mode-watcher"
  import { version } from "$app/environment"
  import { SignOut } from "@auth/sveltekit/components"
  import { flyAndScale } from "$lib/utils/style"

  let isDarkMode = $derived($mode === "dark")
</script>

<ModeWatcher />
<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="rounded-full transition duration-300 outline-none focus:ring-2 focus:outline-none dark:focus:ring-zinc-500 focus:ring-zinc-200"
  >
    <Avatar.Root>
      <Avatar.Image
        src={$page.data.session?.user?.image ||
          `https://unavatar.io/${$page.data.session?.user?.email}?fallback=https://source.boringavatars.com/marble/120/${$page.data.session?.user?.email}?colors=264653r,2a9d8f,e9c46a,f4a261,e76f51`}
        class="rounded"
        alt="User Avatar"
      />
      <Avatar.Fallback><Skeleton class="w-full h-full rounded-full" /></Avatar.Fallback>
    </Avatar.Root>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content
    transition={flyAndScale}
    transitionConfig={{ y: 10, duration: 250 }}
    sideOffset={8}
  >
    <DropdownMenu.Group>
      <DropdownMenu.Label class="justify-start w-full line-clamp-2 truncate">
        <div>
          {$page.data.session?.user?.name ?? $page.data.session?.user?.email}
        </div>
        <div class="font-light text-zinc-400 dark:text-zinc-600">{version}</div>
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
        >Settings</DropdownMenu.Item
      >
      <DropdownMenu.Separator />
      <DropdownMenu.Item class="justify-start hover:cursor-pointer">
        <SignOut signOutPage="signout">Sign Out</SignOut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
