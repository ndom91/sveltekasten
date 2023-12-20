<script lang="ts">
  import Header from "$lib/components/Header.svelte"
  import { page } from "$app/stores"
  import "$lib/styles/style.css"
</script>

<div class="layout">
  <Header />

  <slot />
  <!-- {#if $page.data.session}{:else} -->
  <!--   <span class="notSignedInText"> You are not signed in </span> -->
  <!---->
  <!--   <a href="/login" class="buttonPrimary" data-sveltekit-reload> Sign in </a> -->
  <!-- {/if} -->
</div>

<style>
  .layout {
    padding: 0 2rem;
  }
</style>
