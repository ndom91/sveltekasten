<script lang="ts">
  import { page } from "$app/stores"
  import { Navbar } from "$lib/components/navbar"
  import "$lib/styles/style.css"
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div>
  {#if $page.url.pathname !== "/login"}
    <Navbar formData={data.form} />
  {/if}
  <slot />
</div>
