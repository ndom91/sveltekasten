<script lang="ts">
  import { page } from "$app/stores"
  import { unstate, untrack } from "svelte"

  // let crumbs = $state<Array<{ label: string; href: string }>>([])
  let crumbs: Array<{ label: string; href: string }> = []

  // $effect.pre(() => {
  $: {
    // Remove zero-length tokens.
    const tokens = $page.url.pathname.split("/").filter((t) => t !== "")

    // Create { label, href } pairs for each token.
    let tokenPath = ""
    crumbs = tokens.map((t) => {
      tokenPath += "/" + t
      t = t.charAt(0).toUpperCase() + t.slice(1)
      return { label: t, href: tokenPath }
    })

    // Add a way to get home too.
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
      <a href={c.href}>{c.label}</a>
      <svg
        class="size-4"
        data-slot="icon"
        fill="none"
        stroke-width="1.5"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
      </svg>
    {/if}
  {/each}
</div>
