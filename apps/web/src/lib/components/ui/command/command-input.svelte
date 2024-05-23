<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv"
  import { cn } from "$lib/utils/style"
  import Logo from "$lib/assets/Logo.svelte"

  type $$Props = CommandPrimitive.InputProps & { type?: string }

  let className: string | undefined | null
  export { className as class }
  export let value: string = ""
  export let type: string = ""
</script>

<div class="flex items-center px-2 border-b" data-cmdk-input-wrapper="">
  {#if type === "command-input"}
    <Logo class="!size-7 mr-2" />
  {/if}
  <CommandPrimitive.Input
    class={cn(
      "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...$$restProps}
    bind:value
  />
</div>
