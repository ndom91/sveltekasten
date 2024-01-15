import { browser } from "$app/environment"
import { readable, type Readable } from "svelte/store"

const defaultDocument = browser ? document : undefined

function getCurrentDocumentVisibility(document = defaultDocument): DocumentVisibilityState {
  if (!document) return "visible"

  return document.visibilityState
}

export function documentVisibilityStore(): Readable<DocumentVisibilityState> {
  const visibility = readable(getCurrentDocumentVisibility(defaultDocument), (set) => {
    function handler() {
      set(getCurrentDocumentVisibility())
    }

    if (document) {
      document.addEventListener("visibilitychange", handler)

      return () => {
        document.removeEventListener("visibilitychange", handler)
      }
    }
  })

  return visibility
}
