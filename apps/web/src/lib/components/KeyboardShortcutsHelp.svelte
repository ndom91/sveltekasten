<script lang="ts">
  import Kbd from "$lib/components/KeyboardIndicator.svelte"

  let { element = $bindable() }: { element: HTMLElement } = $props()
</script>

<dialog
  bind:this={element}
  class="z-20 mt-4 rounded-lg shadow-sm md:mt-8 lg:mt-16 bg-neutral-200 dark:bg-neutral-800"
>
  <div class="flex flex-col gap-4 p-8">
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold">Keyboard Shortcuts</h2>
      <button
        class="grid place-items-center rounded-full ring-white transition outline-none hover:ring-2 focus:ring-2 size-7"
        onclick={() => element.close()}
      >
        <svg
          class="rounded-full size-5"
          data-slot="icon"
          fill="none"
          stroke-width="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <table class="table-auto">
      <tbody class="*:h-10">
        <tr class="font-black">
          <td colspan="2">
            <div class="text-lg dark:text-zinc-100">Global</div>
          </td>
          <td colspan="2" class="pl-2">
            <div class="text-lg dark:text-zinc-100">Navigation</div>
          </td>
        </tr>
        <tr>
          <td>Show Shortcut Help</td>
          <td><Kbd key="Ctrl/Cmd" /> <span class="text-xs">+</span> <Kbd key="?" /></td>
          <td class="pl-2">Navigate to Dashboard</td>
          <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="1" /></td>
        </tr>
        <tr>
          <td>Toggle Right Sidebar</td>
          <td><Kbd key="]" /></td>
          <td class="pl-2">Navigate to Bookmarks</td>
          <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="2" /></td>
        </tr>
        <tr>
          <td>Toggle Left Sidebar</td>
          <td><Kbd key="[" /></td>
          <td class="pl-2">Navigate to Feeds</td>
          <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="3" /></td>
        </tr>
        <tr>
          <td>Focus search input</td>
          <td><Kbd key="/" /></td>
          <td class="pl-2">Navigate to Archives</td>
          <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="4" /></td>
        </tr>
        <tr>
          <td>Open "Quick Add" Dialog</td>
          <td><Kbd key="Alt" /> <span class="text-xs">+</span> <Kbd key="N" /></td>
          <td class="pl-2">Navigate to Categories</td>
          <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="5" /></td>
        </tr>
        <tr>
          <td>Open Command Dialog</td>
          <td><Kbd key="Ctrl/Cmd" /> <span class="text-xs">+</span> <Kbd key="K" /></td>
          <td class="pl-2">Navigate to Tags</td>
          <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="6" /></td>
        </tr>
        <tr>
          <td colspan="2" class="font-black">
            <div class="text-lg dark:text-zinc-100">Items Lists</div>
          </td>
          <td class="pl-2">Navigate to Settings</td>
          <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="7" /></td>
        </tr>
        <tr>
          <td>Focus element in list down</td>
          <td class="flex gap-2 items-stretch">
            <Kbd key="j" /> <span class="self-center text-xs">or</span>
            <Kbd>
              <div class="grid place-items-center h-full">
                <svg
                  class="size-3"
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
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  ></path>
                </svg>
              </div>
            </Kbd>
          </td>
        </tr>
        <tr>
          <td>Focus element in list up</td>
          <td class="flex gap-2 items-stretch">
            <Kbd key="k" /> <span class="self-center text-xs">or</span>
            <Kbd>
              <div class="grid place-items-center h-full">
                <svg
                  class="size-3"
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
                    d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                  ></path>
                </svg>
              </div>
            </Kbd>
          </td>
        </tr>
        <tr>
          <td>Open original link</td>
          <td><Kbd key="o" /></td>
        </tr>
        <tr>
          <td>Toggle RSS article open to read</td>
          <td><Kbd key="&bsol;" /></td>
        </tr>
        <tr>
          <td>Toggle Mark as Unread</td>
          <td><Kbd key="u" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</dialog>

<style>
  dialog {
    --open: 0;
    --closed: calc(1 - var(--open));

    transform: translateY(calc(var(--closed) * -50%));

    &,
    &::backdrop {
      /* This works like a conditional statement */
      --duration: calc((var(--open) * 750ms) + (var(--closed) * 0.25s));

      transition: all var(--duration) var(--ease-spring-3) allow-discrete;
      opacity: var(--open);
    }

    &::backdrop {
      backdrop-filter: blur(4px) brightness(0.5);
    }

    &[open] {
      --open: 1;
    }

    @starting-style {
      --open: 1;
      &[open] {
        --open: 0;
      }
    }
  }
</style>
