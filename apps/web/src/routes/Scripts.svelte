<script lang="ts">
  import { partytownSnippet } from "@builder.io/partytown/integration"
  import { onMount } from "svelte"
  import { page } from "$app/stores"
  import { dev } from "$app/environment"

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
        forward: ["plausible"],
      }
    </script>

    <script
      type="text/partytown"
      src="/p.js"
      data-domain="dev.briefkastenhq.com"
      data-api="/add/event"
    ></script>
  {/if}
</svelte:head>
