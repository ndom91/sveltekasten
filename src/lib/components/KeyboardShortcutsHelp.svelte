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
              <td>Show Shortcut Help</td>
              <td><Kbd key="Ctrl + ?" /></td>
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
              <td>Focus element in list down</td>
              <td><Kbd key="j" /> / <Kbd key="ArrowDown" /></td>
            </tr>
            <tr>
              <td>Focus element in list up</td>
              <td><Kbd key="k" /> / <Kbd key="ArrowUp" /></td>
            </tr>
            <tr>
              <td>Open RSS article to read</td>
              <td><Kbd key="\\" /></td>
            </tr>
            <tr>
              <td>Focus search input</td>
              <td><Kbd key="/" /></td>
            </tr>
          </tbody>
        </table>
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
