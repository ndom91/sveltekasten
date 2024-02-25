<script lang="ts">
  import { cn } from "$lib/utils/style"
  import * as Thumbhash from "thumbhash"

  const base64ToBinary = (base64: string) =>
    new Uint8Array(
      atob(base64)
        .split("")
        .map((x) => x.charCodeAt(0)),
    )

  const {
    class: className,
    src,
    thumbhash,
    ...rest
  } = $props<{ class?: string; src: string; thumbhash?: string }>()

  let loaded = $state(false)
  const placeholderURL = $derived(
    thumbhash ? Thumbhash.thumbHashToDataURL(base64ToBinary(thumbhash)) : "",
  )

  const onload = (_el: HTMLImageElement) => {
    loaded = true
  }
</script>

<div class={cn("relative", className)}>
  <img
    class="object-cover object-center absolute top-0 left-0 w-full h-full rounded-md opacity-0 transition duration-500"
    class:srcImageLoaded={loaded}
    use:onload
    {src}
    {...rest}
  />
  <img
    src={placeholderURL}
    alt="Thumbhash Placeholder"
    class="object-cover object-center absolute top-0 left-0 w-full h-full rounded-md transition duration-500 pointer-events-none"
    class:loaded
  />
</div>

<style>
  img.srcImageLoaded {
    display: block !important;
    opacity: 1;
    position: relative;
  }
  img.loaded {
    opacity: 0 !important;
  }
</style>
