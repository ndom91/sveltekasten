<script lang="ts">
  import { cn } from "$lib/utils"

  let className: string = ""
  export { className as class }
</script>

<div
  {...$$restProps}
  class={cn(
    "inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]",
    className,
  )}
  role="status"
>
  <span
    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span
  >
</div>
