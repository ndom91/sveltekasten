<div></div>

<style>
  .adaptive-glass {
    --glass-lightness: 100%;

    background: hsl(0 0% var(--glass-lightness) / 50%);
    backdrop-filter: blur(40px);

    @media (prefers-color-scheme: dark) {
      --glass-lightness: 0%;
    }
  }
</style>
