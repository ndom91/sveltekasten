<script lang="ts">
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import EmptyIllustration from "$lib/assets/blob2.png"
  import Arrow from "$lib/assets/arrow.svg?raw"
</script>

<div class="absolute right-28 top-28 hidden text-zinc-700 dark:text-zinc-100 lg:block" >
  {@html Arrow}
</div>
<div class="mx-auto flex w-1/2 flex-col items-center">
  <img src={EmptyIllustration} alt="Empty" class="w-full max-w-lg grayscale" />
  <p class="mb-4 text-2xl font-light">Looks like there's nothing here!</p>
</div>
