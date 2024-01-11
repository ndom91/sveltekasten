<script lang="ts">
  import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
  import EmptyIllustration from "$lib/assets/empty-state.png"
  import Arrow from "$lib/assets/arrow.svg"
</script>

<img src={Arrow} alt="Arrow" class="absolute right-28 top-28" />
<div class="relative mx-auto w-1/2">
  <img src={EmptyIllustration} alt="Empty" />
  <p class="mb-4 text-center text-2xl font-light">Looks like there's nothing here!</p>
  <p class="text-center text-muted-foreground">
    Get started by adding a bookmark with the "+" button above or by pressing <KeyboardIndicator
      class="text-sm text-white"
      key="Alt N"
    />
  </p>
</div>
