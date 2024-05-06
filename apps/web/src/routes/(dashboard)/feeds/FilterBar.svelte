<script lang="ts">
  import Combobox from "$/lib/components/Combobox.svelte"
  import { page } from "$app/stores"
</script>

<section class="p-4 md:px-8">
  <Combobox data={$page.data.feeds.data} placeholder="Feeds" />
</section>
