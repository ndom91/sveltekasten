/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
//
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"
import { clientsClaim } from "workbox-core"

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
clientsClaim()

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})

self.addEventListener("fetch", (event: FetchEvent) => {
  if (!event.clientId) return

  const url = new URL(event.request.url)
  if (event.request.method === "POST" && url.pathname === "/api/v1/bookmarks/share") {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData()
        const url = formData.get("url") || ""
        // TODO: Get userId
        const userId = "abc123"
        // const body = await event.request.json()
        // const responseUrl = await fetch("/api/v1/bookmarks")

        await fetch("/api/v1/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              url,
              userId,
            },
          ]),
        })
        const client = await self.clients.get(event.clientId)
        client?.postMessage({
          msg: "Got your share!",
          url,
        })
        // TODO: postMessage() back to foreground to alert success or fail
        // https://developer.chrome.com/docs/capabilities/web-apis/web-share-target
        return Response.redirect("/", 303)
      })(),
    )
  }
})

// async function messageClient(clientId) {
//   const client = await clients.get(clientId)
//   client.postMessage("Got Share!")
// }
