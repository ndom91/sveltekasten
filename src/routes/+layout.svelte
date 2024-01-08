<script lang="ts">
  import { Toaster } from "svelte-french-toast"

  import "$lib/styles/style.css"
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
<Toaster />
<slot />
