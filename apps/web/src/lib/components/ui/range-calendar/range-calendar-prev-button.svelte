<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"
  import { buttonVariants } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils/style"

  type $$Props = RangeCalendarPrimitive.PrevButtonProps
  type $$Events = RangeCalendarPrimitive.PrevButtonEvents

  let className: $$Props["class"] = undefined
  export { className as class }
</script>

<RangeCalendarPrimitive.PrevButton
  on:click
  class={cn(
    buttonVariants({ variant: "outline" }),
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
    className,
  )}
  {...$$restProps}
  let:builder
>
  <slot {builder}>
    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
      ><rect width="256" height="256" fill="none" /><polyline
        points="160 208 80 128 160 48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /></svg
    >
  </slot>
</RangeCalendarPrimitive.PrevButton>
