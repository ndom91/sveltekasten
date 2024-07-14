<script lang="ts">
  import { onMount } from "svelte"
  import { page } from "$app/stores"
  import { browser, dev } from "$app/environment"
  import * as Swetrix from "swetrix"
  import { env } from "$env/dynamic/public"

  let url = $state("")
  onMount(() => {
    url = $page.url.pathname
    if ($page.url.searchParams.toString() !== "") {
      url += `?${$page.url.searchParams.toString()}`
    }
    if (!dev && $page.url.hostname === "dev.briefkastenhq.com") {
      Swetrix.init(env.PUBLIC_SWETRIX_PROJECT, { apiURL: env.PUBLIC_SWETRIX_API_HOST })

      Swetrix.trackPageview(url)
    }
  })

  $effect(() => {
    url = $page.url.pathname
    if ($page.url.searchParams.toString() !== "") {
      url += `?${$page.url.searchParams.toString()}`
    }
    if (!dev && browser && $page.url.hostname === "dev.briefkastenhq.com") {
      Swetrix.trackPageview(url)
    }
  })
</script>
