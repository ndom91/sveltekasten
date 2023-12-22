<script lang="ts">
  import { page } from "$app/stores"
  import { signIn, signOut } from "@auth/sveltekit/client"
</script>

<nav class="flex w-full items-center justify-between p-8">
  <div class="flex gap-2">
    <a class:active={$page.url.pathname === "/"} href="/">Blog</a>
    <a class:active={$page.url.pathname === "/drafts"} href="/drafts">Drafts</a>
  </div>
  <div class="flex gap-4">
    {#if $page.data.session?.user}
      <img
        alt="User Avatar"
        src={$page.data.session?.user.image ||
          `https://unavatar.io/${$page.data.session?.user.email}?fallback=https://source.boringavatars.com/marble/120/${$page.data.session?.user.email}?colors=264653r,2a9d8f,e9c46a,f4a261,e76f51`}
        class="h-12 w-12 rounded"
      />
      <button on:click={() => signOut()}>Signout</button>
    {:else if $page.url.pathname !== "/login"}
      <button on:click={() => signIn()}>Login</button>
    {/if}
  </div>
</nav>

<style>
  .active {
    @apply font-bold;
  }
</style>
