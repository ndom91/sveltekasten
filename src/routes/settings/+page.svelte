<script lang="ts">
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import UserSection from "./components/UserSection.svelte"
  import FeedsSection from "./components/FeedsSection.svelte"
  import BookmarksSection from "./components/BookmarksSection.svelte"
  import { Navbar } from "$lib/components/navbar"
  import { CommandBar } from "$lib/components/command-bar"
  import * as Tabs from "$lib/components/ui/tabs"
</script>

<svelte:head>
  <title>Briefkasten | Settings</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<div class="flex h-full">
  <CommandBar />
  <Sidebar />
  <div class="flex flex-col flex-grow">
    <Navbar simple />
    <div class="flex overflow-hidden flex-col">
      <Tabs.Root value="user" class="flex-grow p-4 max-w-screen-2xl">
        <Tabs.List class="*:w-full *:text-lg *:font-light h-12 w-full bg-zinc-100 dark:bg-zinc-800">
          <Tabs.Trigger value="user">User</Tabs.Trigger>
          <Tabs.Trigger value="feeds">Feeds</Tabs.Trigger>
          <Tabs.Trigger value="bookmarks">Bookmarks</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="user" class="overflow-y-scroll max-h-[calc(100vh_-_200px)]">
          <UserSection />
        </Tabs.Content>
        <Tabs.Content value="feeds" class="overflow-y-scroll max-h-[calc(100vh_-_200px)]">
          <FeedsSection />
        </Tabs.Content>
        <Tabs.Content value="bookmarks" class="overflow-y-scroll max-h-[calc(100vh_-_200px)]">
          <BookmarksSection />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>
