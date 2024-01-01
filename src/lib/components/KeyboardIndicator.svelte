<script lang="ts">
  import { cn } from "$lib/utils"

  export let key: string
  let className: string = ""
  export { className as class }
</script>

<kbd {...$$restProps} class={cn("rounded-sm bg-zinc-300 p-1 dark:bg-zinc-600", className)}>
  {key}
</kbd>
