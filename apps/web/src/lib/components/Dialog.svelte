<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    id: string
    children: Snippet
    header?: Snippet
    popoverState?: "auto" | "manual"
    confirmAction?: () => void
    cancelAction?: () => void
    confirmLabel?: Snippet
    cancelLabel?: Snippet
  }

  const {
    id,
    popoverState = "auto",
    confirmAction = () => null,
    cancelAction = () => null,
    children,
    header,
    confirmLabel,
    cancelLabel,
  }: Props = $props()
</script>

<dialog {id} popover={popoverState}>
  {#if header}
    <header class="py-2 border-b border-gray-300">
      {@render header()}
    </header>
  {/if}
  <div class="py-2 border-b border-gray-300">
    {@render children()}
  </div>
  <footer class="flex justify-end py-2 space-x-2">
    <button
      class="danger-button"
      popovertarget={id}
      popovertargetaction="hide"
      onclick={() => confirmAction()}
    >
      {#if confirmLabel}
        {@render confirmLabel()}
      {:else}
        Confirm
      {/if}
    </button>
    <button
      type="button"
      class="primary-button"
      popovertarget={id}
      popovertargetaction="hide"
      onclick={() => cancelAction()}
    >
      {#if cancelLabel}
        {@render cancelLabel()}
      {:else}
        Cancel
      {/if}
    </button>
  </footer>
</dialog>

<style>
  :root {
    --duration: 0.3;
    --speed: calc(var(--duration) * 1s);
    --bounce-out: linear(
      0 0%,
      0.5583 3.72%,
      0.9549 7.72%,
      1.0968 9.86%,
      1.2039 12.13%,
      1.2783 14.57%,
      1.3213 17.23%,
      1.3317 18.7%,
      1.3345 20.27%,
      1.3296 21.97%,
      1.3171 23.83%,
      1.2806 27.25%,
      1.1551 36.58%,
      1.096 41.71%,
      1.0465 47.53%,
      1.014 53.68%,
      0.997 59.87%,
      0.9899 67.32%,
      1 100%
    );
    --easing: linear(
      0 0%,
      0.0027 3.64%,
      0.0106 7.29%,
      0.0425 14.58%,
      0.0957 21.87%,
      0.1701 29.16%,
      0.2477 35.19%,
      0.3401 41.23%,
      0.5982 55.18%,
      0.7044 61.56%,
      0.7987 68.28%,
      0.875 75%,
      0.9297 81.25%,
      0.9687 87.5%,
      0.9922 93.75%,
      1 100%
    );
  }
  dialog {
    --present: 0;
    --scale: 0.95;
    --blur: 10;
    --translate: 12;
    outline: none;
    view-transition-name: dialog;
    scale: calc(var(--scale) + ((1 - var(--scale)) * var(--present)));
    opacity: var(--present);
    filter: blur(calc((var(--blur) * (1 - var(--present))) * 1px));
    translate: 0 calc(calc(var(--translate) * 1lh) * (1 - var(--present)));
    width: 80ch;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 1px 1px rgba(0, 0, 0, 0.02),
      0px 4px 8px -4px rgba(0, 0, 0, 0.04),
      0px 16px 24px -8px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    font-size: 14px;
    transition:
      display var(--speed) var(--easing) allow-discrete,
      scale var(--speed) var(--easing),
      opacity var(--speed) var(--easing),
      filter var(--speed) var(--easing),
      translate calc(var(--speed) * calc(1 + var(--present))) var(--move, var(--easing));
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 1px 1px rgba(0, 0, 0, 0.02),
      0px 4px 8px -4px rgba(0, 0, 0, 0.04),
      0px 16px 24px -8px rgba(0, 0, 0, 0.06);
  }

  dialog[open] {
    --present: 1;
    --move: var(--bounce-out);
  }
  @starting-style {
    dialog[open] {
      --present: 0;
    }
  }

  /* Backdrop */
  dialog::backdrop {
    --present: 0;
    background-color: color-mix(in lch, canvas, transparent 80%);
    backdrop-filter: blur(4px);
    opacity: calc(var(--present) * 1);
    transition:
      overlay var(--speed) var(--easing) allow-discrete,
      opacity var(--speed) var(--easing);
  }
  dialog[open]::backdrop {
    --present: 1;
  }
  @starting-style {
    dialog[open]::backdrop {
      --present: 0;
    }
  }

  ::view-transition-new(dialog) {
    animation: reveal 1s;
    clip-path: inset(0 0 0 0);
    z-index: 2;
  }
  ::view-transition-old(dialog) {
    z-index: -1;
    animation: none;
  }

  @keyframes reveal {
    from {
      clip-path: inset(0 100% 0 0);
    }
  }
</style>
