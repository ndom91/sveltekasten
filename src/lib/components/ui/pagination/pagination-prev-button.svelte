<script lang="ts">
  import { Pagination as PaginationPrimitive } from "bits-ui"
  import { Button } from "$lib/components/ui/button"
  import { cn } from "$lib/utils"

  type $$Props = PaginationPrimitive.PrevButtonProps
  type $$Events = PaginationPrimitive.PrevButtonEvents

  let className: $$Props["class"] = undefined
  export { className as class }
</script>

<PaginationPrimitive.PrevButton asChild let:builder>
  <Button
    variant="ghost"
    class={cn("flex items-center justify-between gap-1 px-2.5", className)}
    builders={[builder]}
    on:click
    {...$$restProps}
  >
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
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
    </svg>
    <span>Previous</span>
  </Button>
</PaginationPrimitive.PrevButton>
