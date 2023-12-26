<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import * as Dialog from "$lib/components/ui/alert-dialog"

  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Button } from "$lib/components/ui/button"

  import type { Bookmark } from "../../types"

  export let open = false
  export let bookmark: Bookmark

  const dispatch = createEventDispatcher<{ close: boolean; submit: null }>()
  const handleClose = (target = false) => {
    dispatch("close", target)
  }

  // @ts-expect-error
  const handleSubmit = (data) => {
    dispatch("submit", data)
  }
</script>

<Dialog.Root bind:open onOpenChange={() => handleClose(!open)}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit bookmark</Dialog.Title>
      <Dialog.Description>
        Make changes to your bookmark here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Title</Label>
        <Input id="title" value={bookmark.title} class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Description</Label>
        <Input id="description" value={bookmark.desc} class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">URL</Label>
        <Input id="url" value={bookmark.url} class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Image</Label>
        <Input id="image" value={bookmark.image} class="col-span-3" />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit" on:click={handleSubmit}>Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
