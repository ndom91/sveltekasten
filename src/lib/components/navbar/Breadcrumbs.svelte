<script lang="ts">
  import { page } from "$app/stores"
  import { unstate, untrack } from "svelte"

  // let crumbs = $state<Array<{ label: string; href: string }>>([])
  let crumbs: Array<{ label: string; href: string }> = []

  // $effect.pre(() => {
  $: {
    // Remove zero-length tokens.
    const tokens = $page.url.pathname.split("/").filter((t) => t !== "")

    let tokenPath = ""
    crumbs = tokens.map((t) => {
      tokenPath += "/" + t
      t = t.charAt(0).toUpperCase() + t.slice(1)
      return { label: t, href: tokenPath }
    })

    crumbs.unshift({ label: "Home", href: "/dashboard" })
  }
</script>

<div class="flex items-center font-light">
  {#each crumbs as c, i}
    {#if i == crumbs.length - 1}
      <span class="label">
        {c.label}
      </span>
    {:else}
      <a href={c.href}>{c.label}</a>&nbsp;/&nbsp;
    {/if}
  {/each}
</div>
