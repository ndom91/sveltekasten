<script lang="ts">
  import { Toaster } from "svelte-french-toast"
  import { onNavigate } from "$app/navigation"
  import "$lib/styles/style.css"

  // View transition
  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<Toaster />
<slot />
