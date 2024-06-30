/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { CacheFirst } from "workbox-strategies"
import { registerRoute, Route } from "workbox-routing"

declare let self: ServiceWorkerGlobalScope

const fontAssetRoute = new Route(
  ({ request }) => {
    return request.destination === "font"
  },
  new CacheFirst({
    cacheName: "font-assets",
  }),
)
const imageAssetRoute = new Route(
  ({ request }) => {
    return request.destination === "image"
  },
  new CacheFirst({
    cacheName: "image-assets",
  }),
)

registerRoute(fontAssetRoute)
registerRoute(imageAssetRoute)

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})

// Special fetch handler for song file sharing.
self.addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url)

  console.log("SW.url", url)

  if (event.request.method !== "GET" || !url.pathname.includes("/api/v1/bookmarks/share")) {
    return
  }

  // Immediately redirect to the start URL, there's nothing to see here.
  event.respondWith(Response.redirect("./?shared=true"))

  event.waitUntil(
    (async function () {
      console.log("SW.event.request.url", event.request.url)
      // const url = new URL(event.request.url)
      const targetUrl = url.searchParams.get("url")
      console.log("SW.targetUrl", targetUrl)

      // TODO: Get userId
      const userId = "clu6qepua0000scqbkr2t0ukz"

      await fetch("/api/v1/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            url: targetUrl,
            event,
            userId,
          },
        ]),
      })

      const client = await self.clients.get(event.clientId)

      client?.postMessage({
        msg: "Got your share!",
        url,
      })
    })(),
  )
})
