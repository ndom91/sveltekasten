<script lang="ts">
  import { cn } from "$lib/utils/style"
  import EmptyIllustration from "$lib/assets/new.png"
  import Arrow from "$lib/assets/arrow.svg?raw"
  import type { Snippet } from "svelte"

  const {
    showArrow = true,
    illustration,
    class: className,
  }: {
    showArrow?: boolean
    illustration?: Snippet
    class?: string
  } = $props()
</script>

{#if showArrow}
  <div class="hidden absolute top-28 right-28 lg:block text-tango">
    {@html Arrow}
  </div>
{/if}
<div class={cn(className, "flex flex-col items-center mx-auto w-full md:w-1/2")}>
  {#if illustration}
    {@render illustration()}
  {:else}
    <img src={EmptyIllustration} alt="Empty" class="w-full max-w-xl grayscale dark:invert" />
  {/if}
  <p class="px-8 mb-4 text-3xl font-light text-center">Looks like there's nothing here!</p>
</div>
