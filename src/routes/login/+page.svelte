<script lang="ts">
  import LoginPattern from "$lib/assets/LoginPattern.svelte"
  import ProviderIcons from "./ProviderIcons.svelte"
  import { twJoin } from "tailwind-merge"
  import { page } from "$app/stores"
  import { SignIn } from "@auth/sveltekit/components"

  $inspect($page.data.providers)

  const providerButtonStyles = (provider: string): string => {
    switch (provider) {
      case "github":
        return "bg-slate-700 hover:bg-slate-800 text-white"
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

<div class="flex overflow-hidden relative w-full h-full">
  <svelte:component
    this={LoginPattern}
    class="object-cover fixed top-0 right-0 min-w-full min-h-full z-[5]"
  />
  <div
    aria-label="Slate cover background"
    class="absolute left-0 top-0 z-10 flex h-[275%] w-[150%] translate-x-[-70%] translate-y-[-28%] rotate-[22deg] items-center bg-slate-900 md:translate-y-[-15%] md:rotate-[11deg]"
  />
  <div class="h-dvh z-20 flex w-full items-center justify-center md:ml-[15%] md:w-[22rem]">
    <div class="flex flex-col justify-center items-center w-80 text-xl">
      <h2 class="flex items-center mb-4 space-x-2 text-3xl font-light text-slate-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="p-2 text-white rounded-full size-12 bg-slate-800"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="text-4xl font-medium text-white">Briefkasten</span>
      </h2>
      <div class="flex flex-col gap-2 p-6 m-8 w-full bg-white rounded shadow-lg">
        {#if !$page.data.session?.user}
          {#if $page.data.providers.includes({ id: "email", name: "Email" })}
            <form>
              <input
                class="block flex-1 p-3 w-full font-normal rounded-md border border-gray-200 transition sm:text-sm placeholder:font-light placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500"
                type="email"
                autoComplete="username"
                placeholder="user@company.com"
              />
              <SignIn
                provider="email"
                signInPage="signin"
                options={{
                  redirectTo: $page.data.redirectTo
                    ? `/${decodeURIComponent($page.data.redirectTo).slice(1)}`
                    : `/dashboard`,
                }}
                className="flex justify-center items-center px-4 mt-2 space-x-2 w-full h-12 text-base font-light text-white rounded transition focus:ring-2 focus:ring-offset-2 focus:outline-none bg-slate-800 hover:bg-slate-900 focus:ring-slate-800"
              >
                Continue
              </SignIn>
            </form>

            <div class="flex gap-2 items-center my-4">
              <div class="flex-1 bg-black h-[1px]" />
              <span class="text-xs leading-4 uppercase">or</span>
              <div class="flex-1 bg-black h-[1px]" />
            </div>
          {/if}
          {#each $page.data.providers as provider}
            <SignIn
              provider={provider.id}
              signInPage="signin"
              options={{
                redirectTo: $page.data.redirectTo
                  ? `/${decodeURIComponent($page.data.redirectTo).slice(1)}`
                  : `/dashboard`,
              }}
              className="w-full"
            >
              <div
                slot="submitButton"
                class={twJoin(
                  "mt-2 flex h-12 w-full items-center space-x-2 rounded px-4 text-base font-light transition focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 group",
                  providerButtonStyles(provider.id),
                )}
              >
                <div
                  class="inline-flex relative items-center w-full transition -translate-x-0 group-hover:-translate-x-6"
                >
                  <div
                    class="absolute opacity-100 transition translate-x-0 group-hover:opacity-0 group-hover:-translate-x-6"
                  >
                    <ProviderIcons provider={provider.id} />
                  </div>
                  <span class="flex justify-center w-full">
                    Signin with {provider.name !== "Azure Active Directory"
                      ? provider.name
                      : "Azure AD"}
                  </span>
                  <div
                    class="absolute right-0 opacity-0 transition translate-x-12 group-hover:opacity-100 group-hover:translate-x-6"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 text-white"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      >
                      </path>
                    </svg>
                  </div>
                </div>
              </div>
            </SignIn>
          {:else}
            <span>No Auth.js Providers found</span>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>
