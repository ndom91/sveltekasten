<script lang="ts">
  import { page } from "$app/stores"
  import { Toaster } from "svelte-french-toast"
  import { Navbar } from "$lib/components/navbar"

  import type { PageData } from "./$types"

  import "$lib/styles/style.css"

  export let data: PageData
</script>

<div>
  <Toaster />
  {#if $page.url.pathname !== "/login"}
    <Navbar formData={data.form} />
  {/if}
  <slot />
</div>
