<script lang="ts">
  import LoginPattern from "$lib/assets/LoginPattern.svelte"
  import ProviderIcons from "./ProviderIcons.svelte"
  import { twJoin } from "tailwind-merge"
  import { signIn } from "@auth/sveltekit/client"
  import { page } from "$app/stores"

  let email = ""

  const handleEmailSignIn = () => {
    signIn("email", { email, callbackUrl: "/dashboard" })
  }

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  const providerButtonStyles = (provider: string): string => {
    switch (provider) {
      case "github":
        return "bg-gray-600 hover:bg-gray-700 text-white"
      case "google":
        return "bg-white hover:bg-gray-100 focus:ring-blue-700 text-gray-800 border border-gray-200 hover:border-gray-100"
      case "azure-ad":
        return "bg-blue-700 hover:bg-blue-900 focus:ring-blue-700 text-white"
      case "authentik":
        return "bg-orange-600 hover:bg-orange-800 text-white"
      case "keycloak":
        return "bg-gray-600 hover:bg-gray-800 text-white"
      default:
        return "bg-gray-600 hover:bg-gray-800 text-white"
    }
  }
</script>

<div class="relative flex h-full w-full overflow-hidden">
  <svelte:component
    this={LoginPattern}
    class="fixed right-0 top-0 z-[5] min-h-full min-w-full object-cover"
  />
  <div
    aria-label="Slate cover background"
    class="absolute left-0 top-0 z-10 flex h-[275%] w-[150%] translate-x-[-70%] translate-y-[-28%] rotate-[22deg] items-center bg-slate-900 md:translate-y-[-15%] md:rotate-[11deg]"
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
          {#if $page.data.providers.includes({ id: "email", name: "Email" })}
            <form on:submit={handleEmailSignIn}>
              <input
                class="block w-full flex-1 rounded-md border border-gray-200 p-3 font-normal transition placeholder:font-light placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                type="email"
                autoComplete="username"
                placeholder="user@company.com"
                bind:value={email}
              />
              <button
                class="mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-slate-800 px-4 text-base font-light text-white transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
                >Continue</button
              >
            </form>

            <div class="my-4 flex items-center gap-2">
              <div class="h-[1px] flex-1 bg-black" />
              <span class="text-xs uppercase leading-4">or</span>
              <div class="h-[1px] flex-1 bg-black" />
            </div>
          {/if}

          {#if $page.data.providers}
            {#each $page.data.providers as provider}
              <button
                class={twJoin(
                  "mt-2 flex h-12 w-full items-center space-x-2 rounded px-4 text-base font-light transition focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2",
                  providerButtonStyles(provider.id),
                )}
                on:click={() => handleSignIn(provider.id)}
              >
                <ProviderIcons provider={provider.id} />
                <span class="flex w-full justify-center">
                  Signin with {provider.name !== "Azure Active Directory"
                    ? provider.name
                    : "Azure AD"}
                </span>
              </button>
            {/each}
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>
