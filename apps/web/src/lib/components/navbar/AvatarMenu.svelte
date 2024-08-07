<script lang="ts">
  import { mode, toggleMode } from "mode-watcher"
  import { signOut } from "@auth/sveltekit/client"
  import { page } from "$app/stores"
  import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { version } from "$app/environment"
  import { flyAndScale } from "$lib/utils/style"
  import { onMount } from "svelte"

  const isDarkMode = $derived($mode === "dark")
  let element = $state<HTMLDialogElement | undefined>()
  let installPrompt: Event | null = $state(null)
  let offerInstall = $state(false)

  const toggleKeyboardShorcuts = () => {
    element?.showModal()
  }

  onMount(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      console.log("beforeinstallprompt", { offerInstall })
      event.preventDefault()
      installPrompt = event
      offerInstall = true
    })

    window.addEventListener("appinstalled", () => {
      console.log("appinstalled", { offerInstall })
      installPrompt = null
      offerInstall = false
    })
  })

  async function handleInstall() {
    if (!installPrompt) {
      return
    }

    // @ts-expect-error TODO: find exact type for beforeinstallprompt Event
    const result = await installPrompt.prompt()
    console.log("Install prompt", result.outcome)

    installPrompt = null
    offerInstall = false
  }
</script>

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
      <DropdownMenu.Label class="justify-start w-full max-w-32">
        <div class="truncate">
          {$page.data.session?.user?.name ?? $page.data.session?.user?.email}
        </div>
        <div class="font-light text-neutral-400 dark:text-neutral-600">{version}</div>
      </DropdownMenu.Label>
      <DropdownMenu.Separator class="bg-neutral-100 dark:bg-neutral-800" />
      <DropdownMenu.CheckboxItem
        class="justify-start hover:cursor-pointer before:content-[''] before:absolute before:left-1 before:bg-neutral-200 before:size-[1.35rem] before:rounded-sm data-[state=checked]:before:bg-neutral-800 [&_svg]:size-4"
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
      <DropdownMenu.Item href="/settings" class="justify-start hover:cursor-pointer">
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
        onclick={() => signOut({ redirectTo: "/login" })}
      >
        Sign Out
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<KeyboardShortcutsHelp bind:dialogElement={element} />
