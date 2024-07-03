<script lang="ts">
  import { enhance } from "$app/forms"
  import { handleActionResults } from "$lib/utils/form-action"
  import { buttonVariants } from "$lib/components/ui/button"
  import Dialog from "$lib/components/Dialog.svelte"
  import { cn } from "$/lib/utils/style"

  let {
    dialogElement = $bindable(),
    bookmarkId,
  }: {
    dialogElement: HTMLDialogElement | null
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
    <form action="/bookmarks?/deleteBookmark" method="post" use:enhance={handleActionResults(() => dialogElement?.close())}>
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
