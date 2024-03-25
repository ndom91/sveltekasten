<script lang="ts">
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import Sidebar from "$lib/components/UserSidebar.svelte"
  import UserSection from "./components/UserSection.svelte"
  import FeedsSection from "./components/FeedsSection.svelte"
  import AboutSection from "./components/AboutSection.svelte"
  import { Navbar } from "$lib/components/navbar"
  import { CommandBar } from "$lib/components/command-bar"
  import * as Tabs from "$lib/components/ui/tabs"

  const tab = $derived($page.url.searchParams.get("tab"))

  const handleTabChange = (data) => {
    goto(`?tab=${data}`)
  }
</script>

<svelte:head>
  <title>Briefkasten | Settings</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<div class="flex h-full">
  <CommandBar />
  <Sidebar />
  <div class="flex flex-col flex-grow items-start w-full">
    <Navbar simple />
    <Tabs.Root
      value={tab ?? "user"}
      class="flex flex-col flex-grow w-full max-w-screen-3xl"
      onValueChange={handleTabChange}
    >
      <div class="p-4">
        <Tabs.List
          class="*:w-full *:text-lg *:font-normal h-12 w-full bg-zinc-100 dark:bg-zinc-800"
        >
          <Tabs.Trigger class="data-[state=active]:shadow-none" value="user">User</Tabs.Trigger>
          <Tabs.Trigger class="data-[state=active]:shadow-none" value="feeds">Feeds</Tabs.Trigger>
          <Tabs.Trigger class="data-[state=active]:shadow-none" value="about">About</Tabs.Trigger>
        </Tabs.List>
      </div>
      <Tabs.Content value="user" class="overflow-y-scroll px-4 pr-2  max-h-[calc(100vh_-_168px)]">
        <UserSection />
      </Tabs.Content>
      <Tabs.Content value="feeds" class="overflow-y-scroll px-4 pr-2  max-h-[calc(100vh_-_168px)]">
        <FeedsSection />
      </Tabs.Content>
      <Tabs.Content value="about" class="overflow-y-scroll px-4 pr-2  max-h-[calc(100vh_-_168px)]">
        <AboutSection />
      </Tabs.Content>
    </Tabs.Root>
  </div>
</div>
