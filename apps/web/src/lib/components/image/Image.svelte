<script lang="ts">
  import * as Thumbhash from "thumbhash"
  import { cn } from "$lib/utils/style"

  const base64ToBinary = (base64: string) => {
    return new Uint8Array(
      atob(base64)
        .split("")
        .map(x => x.charCodeAt(0)),
    )
  }

  const {
    class: className,
    src,
    alt,
    thumbhash,
    ...rest
  }: {
    src: string
    class?: string
    alt?: string
    thumbhash?: string
  } = $props()

  let loaded = $state(false)

  const placeholderURL = $derived.by(() => {
    if (!thumbhash) {
      return ""
    }

    return Thumbhash.thumbHashToDataURL(base64ToBinary(thumbhash))
  })

  const onload = (_el: HTMLImageElement) => {
    loaded = true
  }
</script>

<div class={cn("relative", className)}>
  <img
    class="object-cover object-center absolute top-0 left-0 w-full h-full rounded-md opacity-0 transition duration-500"
    class:srcImageLoaded={loaded}
    use:onload
    alt={alt ?? "Bookmark Image"}
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
