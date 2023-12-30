<script lang="ts">
  import { page } from "$app/stores"
  import { blur } from "svelte/transition"
  import { signOut } from "@auth/sveltekit/client"

  import {
    Avatar,
    Button,
    Checkbox,
    DarkMode,
    Dropdown,
    DropdownItem,
    DropdownDivider,
    DropdownHeader,
    Skeleton,
  } from "flowbite-svelte"

  // let darkMode = $mode === "dark"
</script>

<Avatar
  src={$page.data.session?.user.image ||
    `https://unavatar.io/${$page.data.session?.user.email}?fallback=https://source.boringavatars.com/marble/120/${$page.data.session?.user.email}?colors=264653r,2a9d8f,e9c46a,f4a261,e76f51`}
  rounded={true}
  class="size-12 rounded-full hover:cursor-pointer"
  id="user-avatar"
  alt="User Avatar"
/>
<Dropdown triggeredBy="#user-avatar">
  <DropdownHeader>
    <span class="block text-sm text-gray-900 dark:text-white">{$page.data.session?.user.name}</span>
    <span class="block truncate text-sm font-medium">{$page.data.session?.user.email}</span>
  </DropdownHeader>
  <DropdownItem>
    Dark Mode
    <DarkMode btnClass="size-6" />
  </DropdownItem>
  <DropdownItem><a href="/settings">Settings</a></DropdownItem>
  <DropdownItem slot="footer" on:click={() => signOut()}>Sign out</DropdownItem>
</Dropdown>
