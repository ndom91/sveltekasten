<script lang="ts">
  import { Checkbox as CheckboxPrimitive } from "bits-ui"
  import { cn } from "$lib/utils"

  type $$Props = CheckboxPrimitive.Props
  type $$Events = CheckboxPrimitive.Events

  let className: $$Props["class"] = undefined
  export let checked: $$Props["checked"] = false
  export { className as class }
</script>

<CheckboxPrimitive.Root
  class={cn(
    "peer box-content h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:opacity-50",
    className,
  )}
  bind:checked
  {...$$restProps}
  on:click
>
  <CheckboxPrimitive.Indicator
    class={cn("flex h-4 w-4 items-center justify-center text-current")}
    let:isChecked
    let:isIndeterminate
  >
    {#if isChecked}
      <svg
        class="size-[3.5]"
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
    {:else if isIndeterminate}
      <svg
        class="size-[3.5]"
        data-slot="icon"
        fill="none"
        stroke-width="1.5"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
      </svg>
    {/if}
  </CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
