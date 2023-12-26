<script>
  import { page } from "$app/stores"
</script>

<div class="flex w-full flex-col items-center justify-center gap-4">
  <h1 class="text-xl text-red-400">Oopsie-daisy</h1>
  {#if $page.error?.message}
    <p>{$page.error?.message}</p>
  {:else}
    <p>Something went wrong. Don't worry, we use Sentry!</p>
  {/if}
</div>
