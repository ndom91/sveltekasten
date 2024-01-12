<script lang="ts">
  import { default as Kbd } from "$lib/components/KeyboardIndicator.svelte"
  import * as Dialog from "$lib/components/ui/dialog"

  export let open = false
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Keyboard Shortcuts</Dialog.Title>
      <Dialog.Description>
        <table class="my-4 w-full">
          <tbody class="*:h-10">
            <tr>
              <td colspan="2">
                <div class="text-lg dark:text-zinc-100">Global</div>
              </td>
            </tr>
            <tr>
              <td>Show Shortcut Help</td>
              <td><Kbd key="Ctrl/Cmd" /> <span class="text-xs">+</span> <Kbd key="?" /></td>
            </tr>
            <tr>
              <td>Toggle Right Sidebar</td>
              <td><Kbd key="]" /></td>
            </tr>
            <tr>
              <td>Toggle Left Sidebar</td>
              <td><Kbd key="[" /></td>
            </tr>
            <tr>
              <td>Focus search input</td>
              <td><Kbd key="/" /></td>
            </tr>
            <tr>
              <td>Open "Quick Add" Dialog</td>
              <td><Kbd key="Alt" /> <span class="text-xs">+</span> <Kbd key="N" /></td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="text-lg dark:text-zinc-100">RSS Feed List</div>
              </td>
            </tr>
            <tr>
              <td>Focus element in list down</td>
              <td class="flex items-stretch gap-2">
                <Kbd key="j" /> <span class="self-center text-xs">or</span>
                <Kbd>
                  <div class="grid h-full place-items-center">
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
              <td class="flex items-stretch gap-2">
                <Kbd key="k" /> <span class="self-center text-xs">or</span>
                <Kbd>
                  <div class="grid h-full place-items-center">
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
              <td>Open focused feed element in new tab</td>
              <td><Kbd key="Ctrl/Cmd" /> <span class="text-xs">+</span> <Kbd key="Enter" /></td>
            </tr>
            <tr>
              <td>Open RSS article to read</td>
              <td><Kbd key="\" /></td>
            </tr>
          </tbody>
        </table>
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
