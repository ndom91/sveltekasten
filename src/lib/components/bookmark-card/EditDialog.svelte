<script lang="ts">
  import { createEventDispatcher } from "svelte"

  // import * as Dialog from "$lib/components/ui/alert-dialog"
  // import { Input } from "$lib/components/ui/input"
  // import { Label } from "$lib/components/ui/label"
  // import { Button } from "$lib/components/ui/button"

  import { Modal, Button, Input, Label } from "flowbite-svelte"

  import type { Bookmark } from "../../types"

  export let open = false
  export let bookmark: Bookmark

  const dispatch = createEventDispatcher<{ close: boolean; submit: null }>()
  const handleClose = () => {
    open = false
  }

  console.log("editDialog.open", open)

  // @ts-expect-error
  const handleSubmit = (data) => {
    dispatch("submit", data)
  }
</script>

<Modal bind:open title="Edit Bookmark" on:close={handleClose}>
  <div class="sm:max-w-[425px]">
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
  </div>
  <svelte:fragment slot="footer">
    <Button color="dark" type="submit" on:click={handleSubmit}>Save changes</Button>
    <Button on:click={() => handleClose(false)} color="alternative">No, cancel</Button>
  </svelte:fragment>
</Modal>
