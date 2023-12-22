<script lang="ts">
  import LoginPattern from "$lib/assets/LoginPattern.svelte"
  import { signIn } from "@auth/sveltekit/client"
  import { page } from "$app/stores"

  let email = ""

  const handleEmailSignIn = () => {
    signIn("email", { email, callbackUrl: "/" })
  }

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" })
  }
</script>

<svelte:component
  this={LoginPattern}
  class="fixed right-0 top-0 z-[5] min-h-full min-w-full object-cover"
/>
<div
  aria-label="Slate cover background"
  class="absolute left-0 top-0 z-10 flex h-[275%] w-[150%] translate-x-[-60%] translate-y-[-28%] rotate-[22deg] items-center bg-slate-900 md:w-[70%] md:translate-x-[-30%] md:translate-y-[-25%] md:rotate-[11deg]"
/>
<div class="h-dvh z-20 flex w-full items-center justify-center md:ml-[15%] md:w-[22rem]">
  <div class="flex w-80 flex-col items-center justify-center text-xl">
    <h2 class="mb-4 flex items-center space-x-2 text-3xl font-light text-slate-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        class="size-12 rounded-full bg-slate-800 p-2 text-white"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span class="text-4xl font-medium text-white">Briefkasten</span>
    </h2>
    <div class="m-8 flex w-full flex-col gap-2 rounded bg-white p-6 shadow-lg">
      {#if !$page.data.session?.user}
        <form on:submit={handleEmailSignIn}>
          <input class="w-full" type="email" placeholder="example@gmail.com" bind:value={email} />
          <button class="mt-2 h-12 w-full bg-slate-800 text-white">Continue</button>
        </form>

        <div class="my-4 flex items-center gap-2">
          <div class="h-[1px] flex-1 bg-black" />
          <span class="text-xs uppercase leading-4">or continue with</span>
          <div class="h-[1px] flex-1 bg-black" />
        </div>

        {#if $page.data.providers}
          {#each $page.data.providers as provider}
            <button
              class="h-12 w-full border border-gray-500"
              on:click={() => handleSignIn(provider.id)}
            >
              Continue with {provider.name}
            </button>
          {/each}
        {/if}
      {/if}
    </div>
  </div>
</div>
