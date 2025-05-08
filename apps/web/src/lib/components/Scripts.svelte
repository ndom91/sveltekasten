<script lang="ts">
  import { partytownSnippet } from "@builder.io/partytown/integration"
  import { onMount } from "svelte"
  import { dev } from "$app/environment"
  import { page } from "$app/stores"

  // Set partykit script content
  let scriptTag: HTMLScriptElement
  onMount(() => {
    if (!dev && $page.url.hostname === "dev.briefkastenhq.com") {
      scriptTag.textContent = partytownSnippet()
    }
  })
</script>

<svelte:head>
  <script bind:this={scriptTag}></script>
  <!-- eslint-disable-next-line svelte/valid-compile -->
  {#if !dev && $page.url.hostname === "dev.briefkastenhq.com"}
    <script>
      partytown = {
        forward: ["rybbit"],
      }
    </script>

    <script type="text/partytown" src="r.js" data-site-id="4" defer></script>
  {/if}
</svelte:head>
