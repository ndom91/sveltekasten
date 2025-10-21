<script lang="ts">
import { toast } from "svelte-sonner"
import Dialog from "$lib/components/Dialog.svelte"
import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
import { invalidateAll } from "$app/navigation"
import { page } from "$app/stores"

let {
  dialogElement = $bindable(),
  url,
}: {
  dialogElement: HTMLDialogElement | undefined
  url: string
} = $props()

let loading = $state(false)

const handleConfirm = async (): Promise<void> => {
  try {
    loading = true
    const res = await fetch("/api/v1/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          url,
          userId: $page.data.session?.user?.id,
        },
      ]),
    })

    if (res.ok) {
      await invalidateAll()
      toast.success(`Added "${url}"`)
    }
  } catch (error) {
    console.error(error)
    toast.error(String(error))
  } finally {
    loading = false
    dialogElement?.close()
  }
}
</script>

<Dialog id="confirm-add" bind:element={dialogElement} confirmAction={handleConfirm}>
  {#snippet header()}
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold">Create</h2>
    </div>
  {/snippet}
  {#snippet confirmLabel()}
    Add
    {#if loading}
      <LoadingIndicator size="sm" class="ml-2" />
    {/if}
  {/snippet}
  <div>
    <div>Are you sure you want to add this URL?</div>
    <div class="mt-2 line-clamp-2 break-all font-bold">{url}</div>
  </div>
</Dialog>
