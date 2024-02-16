<script lang="ts">
  import type { ActionData } from "./$types"
  import { enhance } from "$app/forms"
  import { handleActionResults } from "$lib/utils/form-action"
  import { buttonVariants } from "$lib/components/ui/button"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import type { Feed } from "$zod"

  let { form, open, feed } = $props<{
    open: boolean
    feed: Feed
    form?: ActionData
  }>()

  $inspect(form)

  $effect(() => {
    console.log("form effect")
    if (form?.type === "success") {
      console.log("form.type === 'success', closing")
      open = false
    }
  })
</script>

<AlertDialog.Root bind:open closeOnOutsideClick closeOnEscape>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your feed from <span
          class="font-bold">{new URL(feed.url).host}</span
        > and remove any related data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <form action="?/deleteFeed" method="post" use:enhance={handleActionResults()}>
          <input type="hidden" name="feedId" value={feed.id} />
          <button class={buttonVariants({ variant: "destructive" })} type="submit">
            Continue
          </button>
        </form>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
