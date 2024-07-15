<script lang="ts">
  import { onMount } from "svelte"
  import * as Swetrix from "swetrix"
  import { page } from "$app/stores"
  import { dev } from "$app/environment"
  import { env } from "$env/dynamic/public"

  let url = $state("")
  onMount(() => {
    if (
      !dev &&
      $page.url.hostname === "dev.briefkastenhq.com" &&
      env.PUBLIC_SWETRIX_PROJECT &&
      env.PUBLIC_SWETRIX_API_HOST
    ) {
      url = $page.url.pathname
      if ($page.url.searchParams.toString() !== "") {
        url += `?${$page.url.searchParams.toString()}`
      }
      Swetrix.init(env.PUBLIC_SWETRIX_PROJECT, { apiURL: env.PUBLIC_SWETRIX_API_HOST })
    }
  })

  $effect(() => {
    if (
      !dev &&
      $page.url.hostname === "dev.briefkastenhq.com" &&
      env.PUBLIC_SWETRIX_PROJECT &&
      env.PUBLIC_SWETRIX_API_HOST
    ) {
      url = $page.url.pathname
      if ($page.url.searchParams.toString() !== "") {
        url += `?${$page.url.searchParams.toString()}`
      }
      Swetrix.trackPageview(url)
    }
  })
</script>
