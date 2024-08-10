<script lang="ts">
  import { cn } from "$/lib/utils/style"
  import Dialog from "$lib/components/Dialog.svelte"
  import { buttonVariants } from "$lib/components/ui/button"
  import { handleActionResults } from "$lib/utils/form-action"
  import { enhance } from "$app/forms"

  let {
    dialogElement = $bindable(),
    bookmarkId,
  }: {
    dialogElement: HTMLDialogElement | undefined
    bookmarkId: string
  } = $props()
</script>

<Dialog footer={false} id="delete-bookmark" bind:element={dialogElement}>
  <div>
    <h3 class="font-bold text-lg mb-4">Are you sure?</h3>
    <div>This action cannot be undone. This will permanently delete your bookmark.</div>
  </div>
  <div class="flex flex-col sm:flex-row gap-4 sm:justify-end">
    <button
      onclick={() => dialogElement?.close()}
      class={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
    >
      Cancel
    </button>
    <form
      action="/bookmarks?/deleteBookmark"
      method="post"
      use:enhance={handleActionResults(() => dialogElement?.close())}
    >
      <input type="hidden" name="bookmarkId" value={bookmarkId} />
      <button
        class={cn(buttonVariants({ variant: "destructive" }), "w-full sm:w-auto")}
        type="submit"
      >
        Continue
      </button>
    </form>
  </div>
</Dialog>
