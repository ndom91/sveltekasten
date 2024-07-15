import ttsWorkerUrl from "$lib/transformers/tts-worker?url"
import { TTSLocation, useInterface } from "$state/ui.svelte"
import { ofetch } from "ofetch"
import { dev } from "$app/environment"

const ui = useInterface()
let progressItems = $state<TODO>([])
let ttsWorker = $state<Worker>()

export const registerTtsWorker = () => {
  $effect(() => {
    if (
      !ui.aiFeaturesPreferences.tts.enabled
      || ui.aiFeaturesPreferences.tts.location !== TTSLocation.Browser
    ) {
      return
    }
    if (!ttsWorker) {
      ttsWorker = new Worker(new URL(ttsWorkerUrl, import.meta.url), {
        type: "module",
      })
    }

    const onMessageReceived = (e: TODO) => {
      switch (e.data.status) {
        case "initiate":
          // Model file start load: add a new progress item to the list.
          progressItems.push(e.data)
          break

        case "progress":
          // Model file progress: update one of the progress items.
          progressItems = progressItems.map((item: TODO) => {
            if (item.file === e.data.file) {
              return { ...item, progress: e.data.progress }
            }

            return item
          })
          break

        case "done":
          // Model file loaded: remove the progress item from the list.
          progressItems = progressItems.filter((item: TODO) => item.file !== e.data.file)
          break

        case "ready":
          dev && console.log("pipeline ready")
          // Pipeline ready: the worker is ready to accept messages.
          // ready = true
          break

        case "complete":
          const blobUrl = URL.createObjectURL(e.data.output)
          dev && console.log(`Audio Set: ${blobUrl}`)
          ui.textToSpeechAudioBlob = blobUrl
          ui.textToSpeechLoading = false
          dev && console.timeEnd("audio.generate")
          break
      }
    }

    ttsWorker?.addEventListener("message", onMessageReceived)

    return () => ttsWorker?.removeEventListener("message", onMessageReceived)
  })
}

export const handleGenerateSpeech = async (text: string) => {
  if (!ui.aiFeaturesPreferences.tts.enabled) {
    return
  }
  if (ui.aiFeaturesPreferences.tts.location === TTSLocation.Server) {
    const blobData = await ofetch("/api/v1/tts", {
      method: "POST",
      body: {
        speaker: ui.aiFeaturesPreferences.tts.speaker,
        text,
      },
      responseType: "blob",
    })
    const blobUrl = URL.createObjectURL(blobData)
    ui.textToSpeechAudioBlob = blobUrl
    return
  }

  if (
    !ttsWorker
    || !ui.aiFeaturesPreferences.tts.enabled
    || ui.aiFeaturesPreferences.tts.location !== TTSLocation.Browser
  ) {
    return
  }

  dev && console.time("audio.generate")
  ui.textToSpeechLoading = true
  ttsWorker.postMessage({
    text,
  })
}
