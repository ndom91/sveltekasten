<script lang="ts">
  import { page } from "$app/stores"
  import toast from "svelte-french-toast"
  import { invalidate } from "$app/navigation"
  import { buttonVariants } from "$lib/components/ui/button"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"

  let { open, url } = $props<{
    open: boolean
    url: string
  }>()

  const handleConfirm = async (): Promise<void> => {
    try {
      const addResponse = await fetch("/api/v1/bookmarks", {
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
      if (addResponse.ok) {
        toast.success(`Added "${url}"`)
        invalidate("app:bookmarks")
      }
      return
    } catch (error) {
      console.error(error)
      toast.error(String(error))
    } finally {
      open = false
    }
  }
</script>

<AlertDialog.Root bind:open closeOnOutsideClick closeOnEscape>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Add New Bookmark</AlertDialog.Title>
      <AlertDialog.Description>
        <div>Are you sure you want to add this URL?</div>
        <div class="mt-2 font-bold break-all line-clamp-2">{url}?</div>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <button class={buttonVariants({ variant: "default" })} onclick={handleConfirm}>
          Add
        </button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
