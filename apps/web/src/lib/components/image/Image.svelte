<script lang="ts">
  import * as Thumbhash from "thumbhash"
  import { cn } from "$lib/utils/style"

  const base64ToBinary = (base64: string) => {
    return new Uint8Array(
      atob(base64)
        .split("")
        .map((x) => x.charCodeAt(0)),
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

<div
  style="grid-template: 'container';"
  class={cn(
    "relative grid flex-shrink-0 place-content-center place-items-center overflow-hidden rounded-md border border-neutral-100 dark:border-neutral-800",
    "h-36 w-48 md:w-64",
    className,
  )}
>
  <img
    style="grid-area: container;"
    class="aspect-video h-36 w-full rounded-md object-cover opacity-0 transition duration-500"
    class:srcImageLoaded={loaded}
    use:onload
    alt={alt ?? "Bookmark Image"}
    {src}
    {...rest}
  />
  <img
    style="grid-area: container;"
    src={placeholderURL}
    alt="Thumbhash Placeholder"
    class="pointer-events-none h-36 w-full rounded-md object-fill object-left-top transition duration-500"
    class:loaded
  />
</div>

<style>
  img.srcImageLoaded {
    opacity: 1;
  }
  img.loaded {
    opacity: 0 !important;
  }
</style>
