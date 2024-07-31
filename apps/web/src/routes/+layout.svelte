<script lang="ts">
  import { Toaster } from "svelte-sonner"
  import MediaQuery from "$lib/components/MediaQuery.svelte"
  import Shortcuts from "./GlobalShortcuts.svelte"
  import Scripts from "./Scripts.svelte"
  import type { Snippet } from "svelte"
  import "$lib/styles/global.css"

  const { children }: { children: Snippet } = $props()
</script>

<svelte:head>
  <title>BriefButler</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Scripts />

<Shortcuts />

<MediaQuery query="(max-width: 767px)">
  {#snippet children(matches)}
    {#if matches}
      <Toaster
        class="toaster group"
        position="top-left"
        toastOptions={{
          class:
            "bg-white/20 backdrop-blur-md dark:bg-neutral-700/20 dark:text-white dark:border-gray-400/10 border border-gray-200/70",
        }}
      />
    {:else}
      <Toaster
        class="toaster group"
        toastOptions={{
          class:
            "bg-white/20 backdrop-blur-md dark:bg-neutral-700/20 dark:text-white dark:border-gray-400/10 border border-gray-200/70",
        }}
      />
    {/if}
  {/snippet}
</MediaQuery>

{@render children()}
