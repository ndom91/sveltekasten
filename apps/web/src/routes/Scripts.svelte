<script lang="ts">
  import { onMount } from "svelte"
  import * as Swetrix from "swetrix"
  import { page } from "$app/stores"
  import { dev } from "$app/environment"
  import { env } from "$env/dynamic/public"

  let url = $state("")
  onMount(() => {
    url = $page.url.pathname
    if ($page.url.searchParams.toString() !== "") {
      url += `?${$page.url.searchParams.toString()}`
    }
    if (
      !dev &&
      $page.url.hostname === "dev.briefkastenhq.com" &&
      env.PUBLIC_SWETRIX_PROJECT &&
      env.PUBLIC_SWETRIX_API_HOST
    ) {
      Swetrix.init(env.PUBLIC_SWETRIX_PROJECT, { apiURL: env.PUBLIC_SWETRIX_API_HOST })
    }
  })

  $effect(() => {
    url = $page.url.pathname
    if ($page.url.searchParams.toString() !== "") {
      url += `?${$page.url.searchParams.toString()}`
    }
    if (
      !dev &&
      $page.url.hostname === "dev.briefkastenhq.com" &&
      env.PUBLIC_SWETRIX_PROJECT &&
      env.PUBLIC_SWETRIX_API_HOST
    ) {
      Swetrix.trackPageview(url)
    }
  })
</script>
