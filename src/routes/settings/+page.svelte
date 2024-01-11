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

<div class="flex">
  <CommandBar />
  <Sidebar />
  <div class="flex w-full flex-grow flex-col">
    <Navbar simple={true} />

    <Tabs.Root value="user" class="m-4 max-w-screen-2xl flex-grow">
      <Tabs.List class="*:w-full *:text-lg *:font-light h-12 w-full dark:bg-zinc-800">
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
