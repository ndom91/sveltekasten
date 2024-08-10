<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui"
  import { fly } from "svelte/transition"
  import { SheetOverlay, SheetPortal, sheetTransitions, sheetVariants, type Side } from "."
  import { cn } from "$lib/utils/style"

  type $$Props = SheetPrimitive.ContentProps & {
    side?: Side
  }

  let className: $$Props["class"] = undefined
  export let side: $$Props["side"] = "right"
  export { className as class }
  export let inTransition: $$Props["inTransition"] = fly
  export let inTransitionConfig: $$Props["inTransitionConfig"] =
    sheetTransitions[side ? side : "right"]["in"]
  export let outTransition: $$Props["outTransition"] = fly
  export let outTransitionConfig: $$Props["outTransitionConfig"] =
    sheetTransitions[side ? side : "right"]["out"]
</script>

<SheetPortal>
  <SheetOverlay />
  <SheetPrimitive.Content
    {inTransition}
    {inTransitionConfig}
    {outTransition}
    {outTransitionConfig}
    class={cn(sheetVariants({ side }), className)}
    {...$$restProps}
  >
    <slot />
    <SheetPrimitive.Close
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
      </svg>
      <span class="sr-only">Close</span>
    </SheetPrimitive.Close>
  </SheetPrimitive.Content>
</SheetPortal>
