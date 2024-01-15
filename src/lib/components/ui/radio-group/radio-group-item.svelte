<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from "bits-ui"
  import { cn } from "$lib/utils"

  type $$Props = RadioGroupPrimitive.ItemProps
  type $$Events = RadioGroupPrimitive.ItemEvents

  let className: $$Props["class"] = undefined
  export let value: $$Props["value"]
  export { className as class }
</script>

<RadioGroupPrimitive.Item
  {value}
  class={cn(
    "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className,
  )}
  {...$$restProps}
  on:click
>
  <div class="flex justify-center items-center">
    <RadioGroupPrimitive.ItemIndicator>
      <svg
        class="w-2.5 h-2.5 text-current fill-current"
        fill="currentColor"
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
      >
        <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
      </svg>
    </RadioGroupPrimitive.ItemIndicator>
  </div>
</RadioGroupPrimitive.Item>
