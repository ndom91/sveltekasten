<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import { openSheet, page } from "$app/stores"
  import { getContext } from "svelte"

  // let openSheet = false
  //
  // // Retrieve user store from context
  // let settings = getContext("globalsettings")
  // $: settings.set({ openSheet })
  // let openSheet = false
  // $page.data.openSheet = openSheet

  // let openSheet = getContext("openSheet") as boolean
</script>

<Sheet.Root bind:open={openSheet}>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
      <Sheet.Description>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
