<script lang="ts">
  import { default as Kbd } from "$lib/components/KeyboardIndicator.svelte"
  import * as Dialog from "$lib/components/ui/dialog"

  export let open = false
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="!w-[clamp(700px,_33%_,1000px)] !max-w-none">
    <Dialog.Header>
      <Dialog.Title class="text-2xl font-bold">Keyboard Shortcuts</Dialog.Title>
      <Dialog.Description>
        <table class="my-4 w-full">
          <tbody class="*:h-10">
            <tr>
              <td colspan="2">
                <div class="text-lg dark:text-zinc-100">Global</div>
              </td>
              <td colspan="2">
                <div class="text-lg dark:text-zinc-100">Navigation</div>
              </td>
            </tr>
            <tr>
              <td>Show Shortcut Help</td>
              <td><Kbd key="Ctrl/Cmd" /> <span class="text-xs">+</span> <Kbd key="?" /></td>
              <td>Navigate to Dashboard</td>
              <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="1" /></td>
            </tr>
            <tr>
              <td>Toggle Right Sidebar</td>
              <td><Kbd key="]" /></td>
              <td>Navigate to Bookmarks</td>
              <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="2" /></td>
            </tr>
            <tr>
              <td>Toggle Left Sidebar</td>
              <td><Kbd key="[" /></td>
              <td>Navigate to Feeds</td>
              <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="3" /></td>
            </tr>
            <tr>
              <td>Focus search input</td>
              <td><Kbd key="/" /></td>
              <td>Navigate to Archives</td>
              <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="4" /></td>
            </tr>
            <tr>
              <td>Open "Quick Add" Dialog</td>
              <td><Kbd key="Alt" /> <span class="text-xs">+</span> <Kbd key="N" /></td>
              <td>Navigate to Categories</td>
              <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="5" /></td>
            </tr>
            <tr>
              <td>Open Command Dialog</td>
              <td><Kbd key="Ctrl/Cmd" /> <span class="text-xs">+</span> <Kbd key="K" /></td>
              <td>Navigate to Tags</td>
              <td><Kbd key="Shift" /> <span class="text-xs">+</span> <Kbd key="6" /></td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="text-lg dark:text-zinc-100">Items Lists</div>
              </td>
              <td>Navigate to Settings</td>
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
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
