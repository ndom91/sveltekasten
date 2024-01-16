<script lang="ts">
  import { Pagination as PaginationPrimitive } from "bits-ui"
  import { Button } from "$lib/components/ui/button"
  import { cn } from "$lib/utils/style"

  type $$Props = PaginationPrimitive.NextButtonProps
  type $$Events = PaginationPrimitive.NextButtonEvents

  let className: $$Props["class"] = undefined
  export { className as class }
</script>

<PaginationPrimitive.NextButton asChild let:builder>
  <Button
    variant="ghost"
    class={cn("flex items-center justify-between gap-1 px-2.5", className)}
    builders={[builder]}
    on:click
    {...$$restProps}
  >
    <span>Next</span>
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
  </Button>
</PaginationPrimitive.NextButton>
