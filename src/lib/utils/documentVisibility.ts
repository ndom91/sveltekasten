import { browser } from "$app/environment"
import { readable, type Readable } from "svelte/store"

export interface ConfigurableDocument {
  /*
   * Specify a custom `document` instance, e.g. working with iframes or in testing environments.
   */
  document?: Document
}

const defaultDocument = browser ? document : undefined

function getCurrentDocumentVisibility(document = defaultDocument): DocumentVisibilityState {
  if (!document) return "visible"

  return document.visibilityState
}

export function documentVisibilityStore({
  document = defaultDocument,
}: ConfigurableDocument = {}): Readable<DocumentVisibilityState> {
  const visibility = readable(getCurrentDocumentVisibility(document), (set) => {
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
