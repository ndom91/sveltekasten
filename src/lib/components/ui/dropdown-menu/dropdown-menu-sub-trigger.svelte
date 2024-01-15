<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui"
  import { cn } from "$lib/utils"

  type $$Props = DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean
  }
  type $$Events = DropdownMenuPrimitive.SubTriggerEvents

  let className: $$Props["class"] = undefined
  export let inset: $$Props["inset"] = undefined
  export { className as class }
</script>

<DropdownMenuPrimitive.SubTrigger
  class={cn(
    "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground",
    inset && "pl-8",
    className,
  )}
  {...$$restProps}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerleave
  on:pointermove
>
  <slot />
  <svg
    class="ml-auto w-4 h-4"
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
</DropdownMenuPrimitive.SubTrigger>
