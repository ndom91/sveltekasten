<script>
  import { page } from "$app/stores"
  import Logo from "$lib/assets/Logo.svelte"
  import * as Card from "$lib/components/ui/card"
  import { Button } from "$lib/components/ui/button"
  import { ModeWatcher } from "mode-watcher"
</script>

<ModeWatcher />
<div class="flex w-full flex-col items-center justify-center">
  <nav
    class="mx-auto flex h-24 w-full items-center justify-end gap-4 border-b border-b-zinc-100 p-4 dark:border-b-zinc-900"
  >
    <div class="mx-auto flex w-full max-w-7xl items-center justify-start gap-4 text-xl">
      <Logo class="size-8 text-zinc-800 dark:text-zinc-50" />
      <span class="">Error</span>
      <span class="items-center text-red-400">
        {$page.status}
      </span>
    </div>
  </nav>
  <div class="flex w-full flex-col items-center justify-center gap-4">
    <Card.Root class="mt-24 w-[380px]">
      <Card.Header>
        <Card.Title class="flex justify-between gap-2">
          <p class="font-normal">Uh oh, something's gone wrong</p>
        </Card.Title>
      </Card.Header>
      <Card.Content class="grid gap-4">
        <div>
          {#if $page.error?.message}
            <div class="grid">
              <div class="rounded-md p-4 dark:bg-zinc-800">
                <pre>{$page.error?.message}</pre>
              </div>
            </div>
          {/if}
        </div>
      </Card.Content>
      <Card.Footer>
        <Button variant="default" href="/dashboard" class="w-full">
          <svg
            class="size-5 mr-2"
            aria-label="home"
            data-slot="icon"
            fill="none"
            stroke-width="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            ></path>
          </svg>
          Go back Home
        </Button>
      </Card.Footer>
    </Card.Root>
  </div>
</div>
