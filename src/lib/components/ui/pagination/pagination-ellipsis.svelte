<script lang="ts">
  import { cn } from "$lib/utils"
  import type { HTMLAttributes } from "svelte/elements"

  type $$Props = HTMLAttributes<HTMLSpanElement>

  let className: $$Props["class"] = undefined
  export { className as class }
</script>

<span
  aria-hidden
  class={cn("flex h-9 w-9 items-center justify-center", className)}
  {...$$restProps}
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
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    ></path>
  </svg>
  <span class="sr-only">More pages</span>
</span>
