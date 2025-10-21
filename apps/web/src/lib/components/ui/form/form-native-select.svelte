<script lang="ts">
import { Form as FormPrimitive } from "formsnap"
import type { HTMLSelectAttributes } from "svelte/elements"
import { buttonVariants } from "$lib/components/ui/button"
import { cn } from "$lib/utils"

type $$Props = HTMLSelectAttributes

let className: string | undefined | null
export { className as class }
</script>

<div class="relative">
  <FormPrimitive.Select
    class={cn(
      buttonVariants({ variant: "outline" }),
      "appearance-none bg-transparent font-normal",
      className,
    )}
    {...$$restProps}
  >
    <slot />
  </FormPrimitive.Select>
  <svg
    class="absolute top-2.5 right-3 w-4 h-4 opacity-50"
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
