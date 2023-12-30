<script lang="ts">
  import { melt } from "@melt-ui/svelte"
  // import { blur } from "svelte/transition"
  import { page } from "$app/stores"
  // @ts-expect-error
  import type { PageData } from "./$types"
  // import { AvatarMenu } from "$lib/components/navbar"
  import { QuickAddForm, AvatarMenu } from "$lib/components/navbar"
  import { Tooltip, Dialog } from "$lib/components/melt"
  import { Plus } from "lucide-svelte"

  export let formData: PageData.form

  let openDialog = false

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    if (event.altKey && event.code === "KeyN") {
      openDialog = !openDialog
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<nav
  class="*:gap-6 *:flex *:items-center mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-8"
>
  <div class="">
    <a class:active={$page.url.pathname === "/"} href="/">Home</a>
    <a class:active={$page.url.pathname === "/tags"} href="/tags">Tags</a>
    <a class:active={$page.url.pathname === "/categories"} href="/categories">Categories</a>
  </div>
  <div class="">
    {#if $page.data.session?.user}
      <Tooltip textContent="Quick Add Bookmark" let:trigger>
        <button
          use:melt={trigger}
          id="quick-add"
          class="size-7 trigger rounded-full bg-slate-100 p-0 text-black focus:outline-none"
          on:click={() => (openDialog = !openDialog)}
        >
          <Plus class="size-6" />
        </button>
      </Tooltip>
      <Dialog bind:openDialog let:title let:description let:close>
        <svelte:fragment slot="dialog-content">
          <QuickAddForm form={formData} {title} {description} {close} />
        </svelte:fragment>
      </Dialog>
      <AvatarMenu />
    {/if}
  </div>
</nav>

<style lang="postcss">
  .trigger {
    @apply inline-flex items-center justify-center rounded-full bg-white;
    @apply text-zinc-900 transition-colors hover:bg-white/90;
    @apply focus-visible:ring focus-visible:ring-zinc-400 focus-visible:ring-offset-2;
    @apply p-0 text-sm font-medium;
  }
</style>

