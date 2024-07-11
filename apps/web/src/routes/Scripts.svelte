<script lang="ts">
  import { onMount } from "svelte"
  import { watch } from "runed"
  import { page } from "$app/stores"
  import { browser, dev } from "$app/environment"
  import * as Swetrix from "swetrix"
  import { env } from "$env/dynamic/public"

  let url = $page.url.pathname
  if ($page.url.searchParams.toString() !== "") {
    url += `?${$page.url.searchParams.toString()}`
  }
  onMount(() => {
    if (!dev && $page.url.hostname === "dev.briefkastenhq.com") {
      Swetrix.init(env.PUBLIC_SWETRIX_PROJECT, { apiURL: env.PUBLIC_SWETRIX_API_HOST })

      Swetrix.trackPageview(url)
    }
  })

  watch(
    () => url,
    () => {
      browser && Swetrix.trackPageview(url)
    },
  )
</script>
