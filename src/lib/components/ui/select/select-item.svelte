<script lang="ts">
  import { cn } from "$lib/utils/style"
  import { Select as SelectPrimitive } from "bits-ui"

  type $$Props = SelectPrimitive.ItemProps
  type $$Events = SelectPrimitive.ItemEvents

  let className: $$Props["class"] = undefined
  export let value: $$Props["value"]
  export let label: $$Props["label"] = undefined
  export let disabled: $$Props["disabled"] = undefined
  export { className as class }
</script>

<SelectPrimitive.Item
  {value}
  {disabled}
  {label}
  class={cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
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
  <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <SelectPrimitive.ItemIndicator>
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
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path>
      </svg>
    </SelectPrimitive.ItemIndicator>
  </span>
  <slot />
</SelectPrimitive.Item>
