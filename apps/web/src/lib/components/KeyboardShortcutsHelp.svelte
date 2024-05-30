<script lang="ts">
  import Kbd from "$lib/components/KeyboardIndicator.svelte"

  let { element = $bindable() }: { element?: HTMLDialogElement } = $props()
</script>

<dialog
  bind:this={element}
  class="z-20 translate-y-[50%] bg-white rounded-lg shadow-sm md:mt-8 lg:mt-16 dark:bg-zinc-900"
>
  <div class="flex flex-col gap-4 p-1">
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold">Keyboard Shortcuts</h2>
      <button
        class="flex justify-center items-center rounded-full transition outline-none hover:ring-2 focus:ring-2 ring-neutral-300 size-7 dark:ring-neutral-600"
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
          <td colspan="2">
            <div class="text-lg dark:text-zinc-100">Navigation</div>
          </td>
        </tr>
        <tr>
          <td>Show Shortcut Help</td>
          <td><Kbd class="text-xs" key="Ctrl/Cmd + ?" /></td>
          <td>Navigate to Dashboard</td>
          <td><Kbd class="text-xs" key="Shift + 1" /></td>
        </tr>
        <tr>
          <td>Toggle Right Sidebar</td>
          <td><Kbd class="text-xs" key="]" /></td>
          <td>Navigate to Bookmarks</td>
          <td><Kbd class="text-xs" key="Shift + 2" /></td>
        </tr>
        <tr>
          <td>Toggle Left Sidebar</td>
          <td><Kbd class="text-xs" key="[" /></td>
          <td>Navigate to Feeds</td>
          <td><Kbd class="text-xs" key="Shift + 3" /></td>
        </tr>
        <tr>
          <td>Focus search input</td>
          <td><Kbd class="text-xs" key="/" /></td>
          <td>Navigate to Archives</td>
          <td><Kbd class="text-xs" key="Shift + 4" /></td>
        </tr>
        <tr>
          <td>Open "Quick Add" Dialog</td>
          <td><Kbd class="text-xs" key="Alt + N" /></td>
          <td>Navigate to Categories</td>
          <td><Kbd class="text-xs" key="Shift + 5" /></td>
        </tr>
        <tr>
          <td>Open Command Dialog</td>
          <td><Kbd class="text-xs" key="Ctrl/Cmd + K" /></td>
          <td>Navigate to Tags</td>
          <td><Kbd class="text-xs" key="Shift + 6" /></td>
        </tr>
        <tr>
          <td colspan="2" class="font-black">
            <div class="text-lg dark:text-zinc-100">Items Lists</div>
          </td>
          <td>Navigate to Settings</td>
          <td><Kbd class="text-xs" key="Shift + 7" /></td>
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
  :root {
    --duration: 0.3;
    --speed: calc(var(--duration) * 1s);
    --bounce-out: linear(
      0 0%,
      0.5583 3.72%,
      0.9549 7.72%,
      1.0968 9.86%,
      1.2039 12.13%,
      1.2783 14.57%,
      1.3213 17.23%,
      1.3317 18.7%,
      1.3345 20.27%,
      1.3296 21.97%,
      1.3171 23.83%,
      1.2806 27.25%,
      1.1551 36.58%,
      1.096 41.71%,
      1.0465 47.53%,
      1.014 53.68%,
      0.997 59.87%,
      0.9899 67.32%,
      1 100%
    );
    --easing: linear(
      0 0%,
      0.0027 3.64%,
      0.0106 7.29%,
      0.0425 14.58%,
      0.0957 21.87%,
      0.1701 29.16%,
      0.2477 35.19%,
      0.3401 41.23%,
      0.5982 55.18%,
      0.7044 61.56%,
      0.7987 68.28%,
      0.875 75%,
      0.9297 81.25%,
      0.9687 87.5%,
      0.9922 93.75%,
      1 100%
    );
  }
  dialog {
    --present: 0;
    --scale: 0.95;
    --blur: 10;
    --translate: 12;
    outline: none;
    view-transition-name: dialog;
    scale: calc(var(--scale) + ((1 - var(--scale)) * var(--present)));
    opacity: var(--present);
    filter: blur(calc((var(--blur) * (1 - var(--present))) * 1px));
    translate: 0 calc(calc(var(--translate) * 1lh) * (1 - var(--present)));
    width: 80ch;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 1px 1px rgba(0, 0, 0, 0.02),
      0px 4px 8px -4px rgba(0, 0, 0, 0.04),
      0px 16px 24px -8px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    font-size: 14px;
    transition:
      display var(--speed) var(--easing) allow-discrete,
      scale var(--speed) var(--easing),
      opacity var(--speed) var(--easing),
      filter var(--speed) var(--easing),
      translate calc(var(--speed) * calc(1 + var(--present))) var(--move, var(--easing));
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 1px 1px rgba(0, 0, 0, 0.02),
      0px 4px 8px -4px rgba(0, 0, 0, 0.04),
      0px 16px 24px -8px rgba(0, 0, 0, 0.06);
  }

  dialog[open] {
    --present: 1;
    --move: var(--bounce-out);
  }
  @starting-style {
    dialog[open] {
      --present: 0;
    }
  }

  /* Backdrop */
  dialog::backdrop {
    --present: 0;
    background-color: color-mix(in lch, canvas, transparent 80%);
    backdrop-filter: blur(4px);
    opacity: calc(var(--present) * 1);
    transition:
      overlay var(--speed) var(--easing) allow-discrete,
      opacity var(--speed) var(--easing);
  }
  dialog[open]::backdrop {
    --present: 1;
  }
  @starting-style {
    dialog[open]::backdrop {
      --present: 0;
    }
  }

  ::view-transition-new(dialog) {
    animation: reveal 1s;
    clip-path: inset(0 0 0 0);
    z-index: 2;
  }
  ::view-transition-old(dialog) {
    z-index: -1;
    animation: none;
  }

  @keyframes reveal {
    from {
      clip-path: inset(0 100% 0 0);
    }
  }
</style>
