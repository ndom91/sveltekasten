<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui"
  import { cn } from "$lib/utils/style"

  type $$Props = DropdownMenuPrimitive.RadioItemProps
  type $$Events = DropdownMenuPrimitive.RadioItemEvents

  let className: $$Props["class"] = undefined
  export let value: $$Props["value"]
  export { className as class }
</script>

<DropdownMenuPrimitive.RadioItem
  class={cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className,
  )}
  {value}
  {...$$restProps}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerdown
  on:pointerleave
  on:pointermove
>
  <span class="flex absolute left-2 justify-center items-center w-3.5 h-3.5">
    <DropdownMenuPrimitive.RadioIndicator>
      <svg
        class="w-2 h-2 fill-current"
        fill="currentColor"
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
      >
        <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
      </svg>
    </DropdownMenuPrimitive.RadioIndicator>
  </span>
  <slot />
</DropdownMenuPrimitive.RadioItem>
