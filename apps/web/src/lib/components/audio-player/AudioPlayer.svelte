<script lang="ts">
  import AudioVisualizer from "./AudioVisualizer.svelte"

  let { src }: { src: string } = $props()

  let autoplay = $state(true)
  let volume = $state(100)
  let progress = $state(0)
  let paused = $state(false)
  let duration = $state(0)
  let currentTime = $state(0)
  let playbackRate = $state(1)
  let audio = $state<HTMLAudioElement>()

  const togglePlaybackRate = () => {
    if (playbackRate === 1) {
      playbackRate = 1.2
    } else if (playbackRate === 1.2) {
      playbackRate = 1.5
    } else if (playbackRate === 1.5) {
      playbackRate = 0.8
    } else {
      playbackRate = 1
    }
  }
  const togglePlayPause = () => {
    if (paused) {
      audio.pause()
    } else {
      audio.play()
    }
  }
</script>

<div class="flex relative gap-2 items-center py-2 px-3 rounded-md group bg-neutral-900">
  <audio
    {src}
    bind:currentTime
    bind:playbackRate
    bind:duration
    bind:paused
    bind:this={audio}
    class="hidden"
    {autoplay}
  />
  <button onclick={() => (paused = !paused)} class="outline-none">
    {#if !paused}
      <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
        ><rect width="256" height="256" fill="none" /><rect
          x="152"
          y="40"
          width="56"
          height="176"
          rx="8"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><rect
          x="48"
          y="40"
          width="56"
          height="176"
          rx="8"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /></svg
      >
    {:else}
      <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
        ><rect width="256" height="256" fill="none" /><path
          d="M72,39.88V216.12a8,8,0,0,0,12.15,6.69l144.08-88.12a7.82,7.82,0,0,0,0-13.38L84.15,33.19A8,8,0,0,0,72,39.88Z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /></svg
      >
    {/if}
  </button>
  <button class="flex items-center" title="Skip backward 20s" onclick={() => (currentTime -= 20)}>
    <svg class="size-5 scale-x-[-1]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
      ><rect width="256" height="256" fill="none" /><polyline
        points="128 80 128 128 168 152"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><polyline
        points="184 104 224 104 224 64"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><path
        d="M188.4,192a88,88,0,1,1,1.83-126.23C202,77.69,211.72,88.93,224,104"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /></svg
    >
  </button>
  <div class="flex gap-1 h-10">
    <AudioVisualizer {paused} />
  </div>
  <input
    type="range"
    min="0"
    max="100"
    bind:value={progress}
    class="hidden absolute right-2 z-10 w-44 opacity-0 transition duration-300 group-hover:opacity-100 hover:cursor-pointer drop-shadow-3xl accent-neutral-300 dark:accent-neutral-500"
  />
  <input type="range" min="0" max="100" bind:value={volume} class="hidden" />
  <button class="flex items-center" title="Skip forward 20s" onclick={() => (currentTime += 20)}>
    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
      ><rect width="256" height="256" fill="none" /><polyline
        points="128 80 128 128 168 152"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><polyline
        points="184 104 224 104 224 64"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><path
        d="M188.4,192a88,88,0,1,1,1.83-126.23C202,77.69,211.72,88.93,224,104"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /></svg
    >
  </button>
  <button
    class="flex flex-col justify-end items-center"
    title="Skip forward 20s"
    onclick={togglePlaybackRate}
  >
    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
      ><rect width="256" height="256" fill="none" /><path
        d="M24,184V161.13C24,103.65,70.15,56.2,127.63,56A104,104,0,0,1,232,160v24a8,8,0,0,1-8,8H32A8,8,0,0,1,24,184Z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="128"
        y1="56"
        x2="128"
        y2="88"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="104"
        y1="192"
        x2="168"
        y2="104"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="200"
        y1="144"
        x2="230.78"
        y2="144"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="25.39"
        y1="144"
        x2="56"
        y2="144"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /></svg
    >
    <div class="text-xs">{playbackRate.toFixed(1)}</div>
  </button>
</div>
