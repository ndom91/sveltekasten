<script lang="ts">
  import { Toaster } from "svelte-french-toast"

  import "$lib/styles/style.css"
</script>

<div class="flex">
  <Toaster />
  <slot />
</div>
