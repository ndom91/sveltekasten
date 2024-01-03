<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui"
  import { cn } from "$lib/utils"

  type $$Props = SelectPrimitive.TriggerProps
  type $$Events = SelectPrimitive.TriggerEvents

  let className: $$Props["class"] = undefined
  export { className as class }
</script>

<SelectPrimitive.Trigger
  class={cn(
    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className,
  )}
  {...$$restProps}
  let:builder
  on:click
  on:keydown
>
  <slot {builder} />
  <div>
    <svg
      class="size-4 opacity-50"
      data-slot="icon"
      fill="none"
      stroke-width="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path>
    </svg>
  </div>
</SelectPrimitive.Trigger>
