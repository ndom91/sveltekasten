<script lang="ts">
  import { ofetch } from "ofetch"
  import { toast } from "svelte-sonner"
  import { page } from "$app/stores"
  import { invalidateAll } from "$app/navigation"
  import Dialog from "$lib/components/Dialog.svelte"

  let {
    dialogElement = $bindable(),
    url,
  }: {
    dialogElement: HTMLDialogElement | undefined
    url: string
  } = $props()

  const handleConfirm = async (): Promise<void> => {
    try {
      const res = await ofetch.raw("/api/v1/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: [
          {
            url,
            userId: $page.data.session?.user?.id,
          },
        ],
      })

      if (res.ok) {
        await invalidateAll()
        toast.success(`Added "${url}"`)
      }
    } catch (error) {
      console.error(error)
      toast.error(String(error))
    } finally {
      dialogElement?.close()
    }
  }
</script>

<Dialog
  id="confirm-add"
  bind:element={dialogElement}
  confirmLabel="Add"
  confirmAction={handleConfirm}
>
  {#snippet header()}
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold">Create</h2>
    </div>
  {/snippet}
  <div>
    <div>Are you sure you want to add this URL?</div>
    <div class="mt-2 font-bold break-all line-clamp-2">{url}</div>
  </div>
</Dialog>
