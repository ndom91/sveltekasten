<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Modal, Button } from "flowbite-svelte"
  import { AlertTriangle } from "lucide-svelte"

  export let open = false

  const dispatch = createEventDispatcher<{ close: boolean; submit: null }>()
  const handleClose = () => {
    dispatch("close", false)
    open = false
  }

  const handleSubmit = () => {
    dispatch("submit")
  }
</script>

<Modal bind:open size="xs" outsideclose>
  <div class="text-center">
    <AlertTriangle stroke="#000" class="size-32 mx-auto mb-4 text-black dark:text-gray-200" />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Are you sure you want to delete this bookmark?
    </h3>
    <Button on:click={handleSubmit} color="red" class="me-2">Yes, I'm sure</Button>
    <Button on:click={handleClose} color="alternative">No, cancel</Button>
  </div>
</Modal>
