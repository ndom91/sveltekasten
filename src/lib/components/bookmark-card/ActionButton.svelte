<script lang="ts">
  let clicked = false
</script>

<button aria-pressed="false" {...$$props} on:click={() => (clicked = !clicked)} class:clicked>
  <!-- <svg -->
  <!--   xmlns="http://www.w3.org/2000/svg" -->
  <!--   viewBox="0 0 24 24" -->
  <!--   fill="currentColor" -->
  <!--   height="24" -->
  <!--   width="24" -->
  <!-- > -->
  <!--   <path -->
  <!--     d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" -->
  <!--   /> -->
  <!-- </svg> -->
  <slot />
  <span class="sr-only">Like</span>
</button>

<style>
  * {
    box-sizing: border-box;
  }

  :root {
    --elastic-out: linear(
      0,
      0.2178 2.1%,
      1.1144 8.49%,
      1.2959 10.7%,
      1.3463 11.81%,
      1.3705 12.94%,
      1.3726,
      1.3643 14.48%,
      1.3151 16.2%,
      1.0317 21.81%,
      0.941 24.01%,
      0.8912 25.91%,
      0.8694 27.84%,
      0.8698 29.21%,
      0.8824 30.71%,
      1.0122 38.33%,
      1.0357,
      1.046 42.71%,
      1.0416 45.7%,
      0.9961 53.26%,
      0.9839 57.54%,
      0.9853 60.71%,
      1.0012 68.14%,
      1.0056 72.24%,
      0.9981 86.66%,
      1
    );
  }

  body {
    display: grid;
    place-items: center;
    min-height: 100vh;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  button {
    --scale-ease: var(--elastic-out);
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    padding: 0;
    border-radius: 50%;
    border: 0;
    cursor: pointer;
    background: transparent;
    transition:
      scale 1s var(--elastic-out),
      background 0.2s;
  }

  button:is(:hover, :focus-visible) {
    background: hsl(0 0% 94%);
  }

  button svg {
    width: 60%;
    translate: 0 5%;
    stroke-width: 2px;
    stroke: hsl(0 0% 60%);
    fill: none;
    transition:
      stroke 0.2s,
      fill 0.2s;
  }

  .clicked svg {
    fill: hsl(335, 95%, 53%) !important;
    stroke: hsl(335, 95%, 53%) !important;
  }

  button:active {
    scale: 0.8;
    transition: scale 0.2s ease;
  }
</style>
