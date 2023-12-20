<script lang="ts">
  import { page } from "$app/stores"
  import { signIn, signOut } from "@auth/sveltekit/client"
  console.log("HEADER SESSION", $page.data)
</script>

<nav class="w-full flex items-center justify-between p-8">
  <div class="flex gap-2 *:font-bold">
    <a class:active={$page.url.pathname === "/"} href="/">Blog</a>
    <a class:active={$page.url.pathname === "/drafts"} href="/drafts">Drafts</a>
  </div>
  <div class="flex gap-4">
    {#if $page.data.session.user}
      <img
        alt="User Avatar"
        src="{$page.data.session.user.image})"
        class="rounded w-12 h-12"
      />
      <button on:click={() => signOut()}>Signout</button>
    {:else if $page.url.pathname !== "/login"}
      <button on:click={() => signIn()}>Login</button>
    {/if}
    <!-- <button on:click={() => signOut()}>Signout</button> -->
  </div>
</nav>
