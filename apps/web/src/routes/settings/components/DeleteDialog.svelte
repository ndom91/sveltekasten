<script lang="ts">
import { cn } from "$/lib/utils"
import * as AlertDialog from "$lib/components/ui/alert-dialog"
import { buttonVariants } from "$lib/components/ui/button"
import { handleActionResults } from "$lib/utils/form-action"
import type { Feed } from "$lib/types/zod.js"
import type { ActionData } from "./$types"
import { dev } from "$app/environment"
import { enhance } from "$app/forms"

let {
  form,
  open = $bindable(),
  feed,
}: {
  open: boolean
  feed: Feed
  form?: ActionData
} = $props()

$effect(() => {
  if (form?.type === "success") {
    open = false
    if (dev) {
      console.log("form.type === 'success'", { open })
    }
  }
})
</script>

<AlertDialog.Root bind:open closeOnOutsideClick closeOnEscape>
  <AlertDialog.Content class="w-[calc(100%-2rem)]">
    <AlertDialog.Header>
      <AlertDialog.Title class="text-left md:text-center">Are you sure?</AlertDialog.Title>
      <AlertDialog.Description class="text-left md:text-center text-balance">
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
          <button class={cn(buttonVariants({ variant: "destructive" }), "w-full")} type="submit">
            Continue
          </button>
        </form>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
