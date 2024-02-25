<script context="module" lang="ts">
  export type StateChanger = {
    loaded: () => void
    complete: () => void
    reset: () => void
    error: () => void
  }
</script>

<script lang="ts">
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import { buttonVariants } from "$lib/components/ui/button"

  const LOOP_CHECK_TIMEOUT = 1000
  const LOOP_CHECK_MAX_CALLS = 5
  const ERROR_INFINITE_LOOP = `executed the callback function more than ${LOOP_CHECK_MAX_CALLS} times for a short time.`

  class LoopTracker {
    coolingOff = false
    timer: NodeJS.Timeout | null = null
    count = 0

    track() {
      // record track times
      this.count += 1

      // throw warning if the times of continuous calls large than the maximum times
      if (this.count >= LOOP_CHECK_MAX_CALLS) {
        console.error(ERROR_INFINITE_LOOP)

        this.coolingOff = true
        this.timer = setTimeout(() => {
          this.coolingOff = false
          this.count = 0
        }, LOOP_CHECK_TIMEOUT)
      }
    }
  }

  const STATUS = {
    READY: "READY",
    LOADING: "LOADING",
    COMPLETE: "COMPLETE",
    ERROR: "ERROR",
  } as const

  const stateChanger = {
    loaded: () => {
      isFirstLoad = false
      status = STATUS.READY
    },
    complete: () => {
      status = STATUS.COMPLETE
    },
    reset: () => {
      status = STATUS.READY
      isFirstLoad = true
    },
    error: () => {
      status = STATUS.ERROR
    },
  }

  const loopTracker = new LoopTracker()

  const { triggerLoad } = $props<{ triggerLoad: (stateChanger: StateChanger) => Promise<void> }>()

  let isFirstLoad = $state(true)
  let status = $state<keyof typeof STATUS>(STATUS.READY)
  let intersectionTarget = $state<HTMLElement>()
  let observer = $state<IntersectionObserver>()

  let showSpinner = $derived(status === STATUS.LOADING)
  let showError = $derived(status === STATUS.ERROR)
  let showNoResults = $derived(status === STATUS.COMPLETE && isFirstLoad)
  let showNoMore = $derived(status === STATUS.COMPLETE && !isFirstLoad)

  $inspect("status", status)

  async function attemptLoad() {
    if (status === STATUS.COMPLETE) {
      return
    }
    status = STATUS.LOADING

    if (!loopTracker.coolingOff) {
      console.log("typeof triggerLoad", typeof triggerLoad)
      console.log("triggerLoad", triggerLoad)
      await triggerLoad(stateChanger)
    }
    loopTracker.track()

    if (status === STATUS.LOADING) {
      status = STATUS.READY
    }
  }

  // TODO: Observor not starting observation without
  // some sort of action after 'observer.observe()'.
  // 'return' unnecessary/wrong here in $effect
  // @ts-expect-error
  $effect(() => {
    if (!observer) {
      if (intersectionTarget) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              attemptLoad()
            }
          },
          { threshold: 0.5 },
        )
        observer.observe(intersectionTarget)
        return observer
      }
    }
    return () => observer?.disconnect()
  })
</script>

<div class="h-full">
  <slot />

  {#if showSpinner}
    <LoadingIndicator />
  {/if}

  {#if showNoResults}
    <div>No results</div>
  {/if}

  {#if showNoMore}
    <div>No more data</div>
  {/if}

  {#if showError}
    <div class="flex flex-col gap-4 items-center">
      Oops, something went wrong
      <button class={buttonVariants({ variant: "default" })} on:click={attemptLoad}> Retry </button>
    </div>
  {/if}

  <div class="h-48" bind:this={intersectionTarget} />
</div>
