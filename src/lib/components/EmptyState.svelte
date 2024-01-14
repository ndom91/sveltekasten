<script lang="ts">
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import EmptyIllustration from "$lib/assets/blob2.png"
  import Arrow from "$lib/assets/arrow.svg?raw"
</script>

<div class="hidden absolute top-28 right-28 lg:block text-zinc-700 dark:text-zinc-100">
  {@html Arrow}
</div>
<div class="flex flex-col items-center mx-auto w-1/2">
  <img src={EmptyIllustration} alt="Empty" class="w-full max-w-lg grayscale" />
  <p class="mb-4 text-2xl font-light">Looks like there's nothing here!</p>
</div>
