<script lang="ts">
import { redirect } from "@sveltejs/kit"
import { mode, toggleMode } from "mode-watcher"
import { onMount } from "svelte"
import { version } from "$app/environment"
import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { page } from "$app/state"
import { authClient } from "$lib/auth-client"
import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
import * as Avatar from "$lib/components/ui/avatar"
import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
import { Skeleton } from "$lib/components/ui/skeleton"

const isDarkMode = $derived(mode.current === "dark")
let element = $state<HTMLDialogElement | undefined>()
let installPrompt: Event | null = $state(null)
let offerInstall = $state(false)

const toggleKeyboardShorcuts = () => {
  element?.showModal()
}

onMount(() => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault()
    installPrompt = event
    offerInstall = true
    console.log("beforeinstallprompt", { offerInstall })
  })

  window.addEventListener("appinstalled", () => {
    installPrompt = null
    offerInstall = false
    console.log("appinstalled", { offerInstall })
  })
})

async function handleInstall() {
  if (!installPrompt) {
    return
  }

  // @ts-expect-error TODO: find exact type for beforeinstallprompt Event
  const result = await installPrompt.prompt()
  console.log("prompt.result", result.outcome)

  installPrompt = null
  offerInstall = false
}

$inspect(page.data)
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="rounded-full outline-none transition duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500"
  >
    <Avatar.Root>
      <Avatar.Image
        src={page.data?.user?.image ||
          `https://unavatar.io/${page.data?.user?.email}?fallback=https://source.boringavatars.com/marble/120/${page.data?.user?.email}?colors=264653r,2a9d8f,e9c46a,f4a261,e76f51`}
        class="rounded"
        alt="User Avatar"
      />
      <Avatar.Fallback><Skeleton class="h-full w-full rounded-full" /></Avatar.Fallback>
    </Avatar.Root>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content
    sideOffset={8}
  >
    <DropdownMenu.Group>
      <DropdownMenu.Label class="max-w-32 w-full justify-start">
        <div class="truncate">
          {page.data?.user?.name ?? page.data?.user?.email}
        </div>
        <div class="font-light text-neutral-400 dark:text-neutral-600">{version}</div>
      </DropdownMenu.Label>
      <DropdownMenu.Separator class="bg-neutral-100 dark:bg-neutral-800" />
      <DropdownMenu.CheckboxItem
        class="before:size-[1.35rem] [&_svg]:size-4 justify-start before:absolute before:left-1 before:rounded-sm before:bg-neutral-200 before:content-[''] hover:cursor-pointer data-[state=checked]:before:bg-neutral-800"
        onCheckedChange={toggleMode}
        checked={isDarkMode}
      >
        Dark Mode
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.Item
        onclick={toggleKeyboardShorcuts}
        class="justify-start hover:cursor-pointer"
      >
        Show Shortcuts
      </DropdownMenu.Item>
      <DropdownMenu.Item class="justify-start hover:cursor-pointer" onclick={() => goto(resolve('/settings'))}>
        Settings
      </DropdownMenu.Item>
      {#if offerInstall}
        <DropdownMenu.Item
          onclick={handleInstall}
          id="install-button"
          class="justify-start hover:cursor-pointer"
        >
          Install
        </DropdownMenu.Item>
      {/if}
      <DropdownMenu.Separator class="bg-neutral-100 dark:bg-neutral-800" />
      <DropdownMenu.Item
        class="justify-start hover:cursor-pointer"
        onclick={() => authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect(303, "/login");
            },
          }
        })}
      >
        Sign Out
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<KeyboardShortcutsHelp bind:dialogElement={element} />
