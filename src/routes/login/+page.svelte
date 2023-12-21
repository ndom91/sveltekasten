<script lang="ts">
  import { signIn, signOut } from "@auth/sveltekit/client"
  import { page } from "$app/stores"
  // import logo from "$lib/assets/logo.png"

  let email = ""

  const handleEmailSignIn = () => {
    signIn("email", { email, callbackUrl: "/" })
  }

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/" })
  }

  const handleSignOut = () => {
    signOut()
  }
</script>

<div
  class="flex z-20 w-[22rem] flex-col items-center justify-center text-xl md:ml-[15%]"
>
  <h2
    class="mb-4 flex items-center space-x-2 text-3xl font-light text-slate-600"
  >
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
        <input
          class="w-full"
          type="email"
          placeholder="example@gmail.com"
          bind:value={email}
        />
        <button class="bg-slate-800 text-white mt-2 w-full h-12"
          >Continue</button
        >
      </form>

      <div class="my-4 flex gap-2 items-center">
        <div class="flex-1 h-[1px] bg-black" />
        <span class="text-sm leading-4">OR</span>
        <div class="flex-1 h-[1px] bg-black" />
      </div>

      <button
        class="w-full h-12 border border-gray-500"
        on:click={handleGithubSignIn}
      >
        Continue with Github
      </button>
    {/if}
  </div>
</div>

<style>
</style>
