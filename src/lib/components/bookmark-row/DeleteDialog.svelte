<script lang="ts">
  import { page } from "$app/stores"
  import type { ActionData } from "./$types"
  import { enhance } from "$app/forms"
  import { form_action } from "$lib/form_action"
  import { buttonVariants } from "$lib/components/ui/button"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"

  let { open, bookmarkId } = $props<{
    form?: ActionData
    open: boolean
    bookmarkId: string
  }>()

  $effect(() => {
    if ($page.form?.type === "success") {
      open = false
    }
  })
</script>

<AlertDialog.Root bind:open closeOnOutsideClick closeOnEscape>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your bookmark.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <form action="?/deleteBookmark" method="post" use:enhance={form_action()}>
          <input type="hidden" name="bookmarkId" value={bookmarkId} />
          <button class={buttonVariants({ variant: "destructive" })} type="submit">
            Continue
          </button>
        </form>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
