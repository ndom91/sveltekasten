<script lang="ts">
  import { mode, toggleMode } from "mode-watcher"
  import { SignOut } from "@auth/sveltekit/components"
  import { page } from "$app/stores"
  import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { version } from "$app/environment"
  import { flyAndScale } from "$lib/utils/style"
  import { onMount, type SvelteComponent } from "svelte"

  const isDarkMode = $derived($mode === "dark")
  let element = $state<HTMLDialogElement | null>(null)
  let installPrompt: Event | null = $state(null)
  let installButton: SvelteComponent | null = $state(null)

  const toggleKeyboardShorcuts = () => {
    element?.showModal()
  }

  onMount(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      console.log("beforeinstallprompt", installButton)
      event.preventDefault()
      installPrompt = event
      installButton?.classList.toggle("hidden", false)
    })

    window.addEventListener("appinstalled", () => {
      console.log("appinstalled", installButton)
      installPrompt = null
      installButton?.classList.toggle("hidden", true)
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
    installButton?.classList.toggle("hidden", true)
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
        <div class="font-light text-zinc-400 dark:text-zinc-600">{version}</div>
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
      <DropdownMenu.Item
        bind:this={installButton}
        onclick={handleInstall}
        class="hidden justify-start hover:cursor-pointer"
      >
        Install
      </DropdownMenu.Item>
      <DropdownMenu.Separator class="bg-neutral-100 dark:bg-neutral-800" />
      <DropdownMenu.Item class="justify-start hover:cursor-pointer">
        <SignOut signOutPage="signout" class="w-full *:text-left *:w-full">
          <div slot="submitButton" class="w-full">Sign Out</div>
        </SignOut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<KeyboardShortcutsHelp bind:dialogElement={element} />
