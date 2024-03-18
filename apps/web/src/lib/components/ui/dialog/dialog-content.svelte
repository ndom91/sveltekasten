<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui"
  import * as Dialog from "."
  import { cn, flyAndScale } from "$lib/utils/style"

  type $$Props = DialogPrimitive.ContentProps

  let className: $$Props["class"] = undefined
  export let transition: $$Props["transition"] = flyAndScale
  export let transitionConfig: $$Props["transitionConfig"] = {
    duration: 200,
  }
  export { className as class }
</script>

<Dialog.Portal>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    {transition}
    {transitionConfig}
    class={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full",
      className,
    )}
    {...$$restProps}
  >
    <slot />
    <DialogPrimitive.Close
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
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
    </DialogPrimitive.Close>
  </DialogPrimitive.Content>
</Dialog.Portal>
