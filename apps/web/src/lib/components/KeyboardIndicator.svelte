<script lang="ts">
  import { cn } from "$lib/utils/style"

  export let key: string = ""
  let className = ""
  export { className as class }
</script>

<kbd
  {...$$restProps}
  class={cn(
    "inline-block rounded-sm bg-zinc-300 p-1 px-2 text-zinc-800 dark:bg-neutral-600 dark:text-zinc-100 border-b-[3px]",
    className,
  )}
>
  {#if $$slots.default}
    <slot />
  {:else if key}
    {key}
  {/if}
</kbd>
