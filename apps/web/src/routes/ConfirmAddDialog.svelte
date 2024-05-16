<script lang="ts">
  import { ofetch } from "ofetch"
  import { toast } from "svelte-sonner"
  import { page } from "$app/stores"
  import { invalidate } from "$app/navigation"
  import { buttonVariants } from "$lib/components/ui/button"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"

  let {
    open = $bindable(),
    url,
  }: {
    open: boolean
    url: string
  } = $props()

  const handleConfirm = async (): Promise<void> => {
    try {
      await ofetch("/api/v1/bookmarks", {
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
      toast.success(`Added "${url}"`)
      invalidate("app:bookmarks")
    } catch (error) {
      console.error(error)
      toast.error(String(error))
    } finally {
      open = false
    }
  }
</script>

<AlertDialog.Root bind:open closeOnOutsideClick closeOnEscape>
  <AlertDialog.Content class="!shadow-sm">
    <AlertDialog.Header>
      <AlertDialog.Title>Create</AlertDialog.Title>
      <AlertDialog.Description>
        <div>Are you sure you want to add this URL?</div>
        <div class="mt-2 font-bold break-all line-clamp-2">{url}</div>
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
