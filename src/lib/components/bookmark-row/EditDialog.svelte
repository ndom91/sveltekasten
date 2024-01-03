<script lang="ts">
  import { enhance } from "$app/forms"
  import { form_action } from "$lib/form_action"
  import { buttonVariants } from "$lib/components/ui/button"
  import * as Dialog from "$lib/components/ui/alert-dialog"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import type { Bookmark } from "$zod"

  let { open, bookmark } = $props<{ open: boolean; bookmark: Bookmark }>()
</script>

<Dialog.Root bind:open closeOnOutsideClick closeOnEscape>
  <Dialog.Content class="sm:max-w-[425px]">
    <form action="?/editBookmark" method="post" use:enhance={form_action()}>
      <Dialog.Header>
        <Dialog.Title>Edit bookmark</Dialog.Title>
        <Dialog.Description>
          Make changes to your bookmark here. Click save when you're done.
        </Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Title</Label>
          <Input name="title" id="title" value={bookmark.title} class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Description</Label>
          <Input name="description" id="description" value={bookmark.desc} class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">URL</Label>
          <Input name="url" id="url" value={bookmark.url} class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Image</Label>
          <Input name="image" id="image" value={bookmark.image} class="col-span-3" />
        </div>
      </div>
      <Dialog.Footer>
        <input type="hidden" name="id" value={bookmark.id} />
        <button class={buttonVariants({ variant: "default" })} type="submit"> Save Changes </button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
