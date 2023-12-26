<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import * as AlertDialog from "$lib/components/ui/alert-dialog"

  export let open = false

  const dispatch = createEventDispatcher<{ close: boolean; submit: null }>()
  const handleClose = () => {
    dispatch("close", false)
  }

  const handleSubmit = () => {
    dispatch("submit")
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel on:click={handleClose}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={handleSubmit}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
