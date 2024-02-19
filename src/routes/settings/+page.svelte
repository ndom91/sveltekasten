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
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class="flex h-full">
  <CommandBar />
  <Sidebar />
  <div class="flex flex-col flex-grow w-full">
    <Navbar simple />
    <div class="flex overflow-y-scroll flex-col w-full h-full">
      <Tabs.Root value="user" class="flex-grow m-4 max-w-screen-2xl">
        <Tabs.List class="*:w-full *:text-lg *:font-light h-12 w-full bg-zinc-100 dark:bg-zinc-800">
          <Tabs.Trigger value="user">User</Tabs.Trigger>
          <Tabs.Trigger value="feeds">Feeds</Tabs.Trigger>
          <Tabs.Trigger value="bookmarks">Bookmarks</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="user">
          <UserSection />
        </Tabs.Content>
        <Tabs.Content value="feeds">
          <FeedsSection />
        </Tabs.Content>
        <Tabs.Content value="bookmarks">
          <BookmarksSection />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>
