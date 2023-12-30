<script lang="ts">
  import { blur } from "svelte/transition"
  import { page } from "$app/stores"
  import type { PageData } from "./$types"
  import { Button, Tooltip, Modal } from "flowbite-svelte"
  import { QuickAddForm, AvatarMenu } from "$lib/components/navbar"
  import { Plus } from "lucide-svelte"

  export let formData: PageData.form

  let open = false

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    if (event.altKey && event.code === "KeyN") {
      open = !open
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
      <Button
        id="quick-add"
        variant="outline"
        class="size-11 rounded-full p-0"
        on:click={() => (open = !open)}
      >
        <Plus class="size-4" />
      </Button>
      <Tooltip triggeredBy="#quick-add">
        <p>Quick add Bookmark</p>
      </Tooltip>
      <Modal bind:open outsideclose>
        <QuickAddForm form={formData} />
      </Modal>
      <!-- <AvatarMenu /> -->
    {/if}
  </div>
</nav>

<style>
  .active {
    @apply font-bold;
  }
</style>
