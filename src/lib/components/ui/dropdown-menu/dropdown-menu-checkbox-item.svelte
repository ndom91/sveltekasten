<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui"
  import { cn } from "$lib/utils"

  type $$Props = DropdownMenuPrimitive.CheckboxItemProps
  type $$Events = DropdownMenuPrimitive.CheckboxItemEvents

  let className: $$Props["class"] = undefined
  export let checked: $$Props["checked"] = undefined
  export { className as class }
</script>

<DropdownMenuPrimitive.CheckboxItem
  bind:checked
  class={cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
    className,
  )}
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
    <DropdownMenuPrimitive.CheckboxIndicator>
      <svg
        class="size-5"
        data-slot="icon"
        fill="none"
        stroke-width="1.5"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path>
      </svg>
    </DropdownMenuPrimitive.CheckboxIndicator>
  </span>
  <slot />
</DropdownMenuPrimitive.CheckboxItem>
