<script lang="ts">
  import { useInterface } from "$state/ui.svelte"
  const ui = useInterface()

  const isEditMode = $derived(ui.metadataSidebarEditMode === true)
</script>
