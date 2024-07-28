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
    "relative grid place-items-center flex-shrink-0 place-content-center overflow-hidden rounded-md border border-neutral-100 dark:border-neutral-800",
    "md:w-64 w-48 max-h-36",
    className,
  )}
>
  <img
    style="grid-area: container;"
    class="object-cover w-full h-auto aspect-video rounded-md opacity-0 transition duration-500"
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
    class="object-fill object-left-top rounded-md transition duration-500 pointer-events-none"
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
