<script lang="ts">
  import { onMount } from "svelte"
  import { page } from "$app/stores"
  import { dev } from "$app/environment"
  import * as Swetrix from "swetrix"
  import { env } from "$env/dynamic/public"

  onMount(() => {
    if (!dev && $page.url.hostname === "dev.briefkastenhq.com") {
      Swetrix.init(env.PUBLIC_SWETRIX_PROJECT, { apiURL: env.PUBLIC_SWETRIX_API_HOST })

      let url = $page.url.pathname
      if ($page.url.searchParams.toString() !== "") {
        url += `?${$page.url.searchParams.toString()}`
      }
      Swetrix.trackPageview(url)
    }
  })
</script>
