<script lang="ts">
  import { signIn } from "@auth/sveltekit/client"
  import { page } from "$app/stores"

  let email = ""

  const handleEmailSignIn = () => {
    signIn("email", { email, callbackUrl: "/" })
  }

  const handleSignIn = (provider) => {
    signIn(provider, { callbackUrl: "/" })
  }
</script>

<div
  class="fixed left-0 top-0 z-[5] min-h-full min-w-full object-contain"
  style="background: linear-gradient(220.55deg, #565656 0%, #181818 100%);"
/>
<div class="z-20 flex w-[22rem] flex-col items-center justify-center text-xl md:ml-[15%]">
  <h2 class="mb-4 flex items-center space-x-2 text-3xl font-light text-slate-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      class="h-10 w-10 rounded-full bg-slate-800 p-2 text-white lg:h-12 lg:w-12"
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

<style>
</style>
