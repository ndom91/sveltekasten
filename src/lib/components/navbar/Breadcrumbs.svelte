<script lang="ts">
  import { page } from "$app/stores"

  let crumbs: Array<{ label: string; href: string }> = []

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
      <span class="p-1">
        {c.label}
      </span>
    {:else}
      <a
        class="rounded-sm p-1 outline-none focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500"
        href={c.href}>{c.label}</a
      >&nbsp;/&nbsp;
    {/if}
  {/each}
</div>
