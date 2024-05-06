import { useInterface } from "$state/ui.svelte"
import toast from "svelte-french-toast"
import { dev } from "$app/environment"
import summaryWorkerUrl from "$lib/transformers/summary-worker?url"

const ui = useInterface()

let summaryWorker = $state<Worker>()

export const registerSummarizationWorker = () => {
  $effect(() => {
    if (!summaryWorker && ui.aiFeaturesPreferences.summarization.enabled) {
      summaryWorker = new Worker(new URL(summaryWorkerUrl, import.meta.url), {
        type: "module",
      })
    }

    const onMessageReceived = (e: TODO) => {
      switch (e.data.status) {
        case "complete":
          ui.summarizationLoading = false

          // TODO: UI to display summary
          toast.success(e.data.output, { duration: 10000, icon: "" })
          console.log("Summary:", e.data.output)

          dev && console.timeEnd("summary.generate")
          break
      }
    }

    summaryWorker?.addEventListener("message", onMessageReceived)

    return () => summaryWorker?.removeEventListener("message", onMessageReceived)
  })
}

export const handleSummarizeText = (text: string) => {
  if (!summaryWorker || !ui.aiFeaturesPreferences.summarization.enabled) {
    return
  }
  dev && console.time("summary.generate")
  ui.summarizationLoading = true
  summaryWorker.postMessage({
    text,
  })
}
