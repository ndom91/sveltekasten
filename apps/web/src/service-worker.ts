/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope

import { CacheFirst } from "workbox-strategies"
import { registerRoute, Route } from "workbox-routing"
import { ExpirationPlugin } from "workbox-expiration"

// Special fetch handler for song file sharing.
sw.addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url)

  if (event.request.method !== "GET" || !url.pathname.includes("/api/v1/bookmarks/share")) {
    return
  }

  // Handle Web Share Target requests
  // Immediately redirect to the start URL, there's nothing to see here.
  event.respondWith(Response.redirect("./?shared=true"))

  event.waitUntil(
    (async function () {
      const textParam = url.searchParams.get("text")
      const urlParam = url.searchParams.get("link")

      const targetUrl = urlParam ?? textParam ?? ""
      const decodedTargetUrl = decodeURIComponent(targetUrl)

      await fetch("/api/v1/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            url: decodedTargetUrl,
            userId: "sw",
          },
        ]),
      })

      sw.clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          client?.postMessage({
            type: "SHARE_SUCCES",
            payload: {
              message: "Bookmark Added",
              url: decodedTargetUrl,
            },
          })
        }
      })
      // const client = await sw.clients.get(event.clientId)
      // client?.postMessage({
      //   type: "SHARE_SUCCES",
      //   payload: {
      //     message: "Bookmark Added",
      //   },
      // })
    })(),
  )
})

sw.addEventListener("activate", (event) => {
  sw.clients.claim()

  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key)
    }
  }

  event.waitUntil(deleteOldCaches())
})

sw.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") sw.skipWaiting()
})

const fontAssetRoute = new Route(
  ({ request }) => {
    return request.destination === "font"
  },
  new CacheFirst({
    cacheName: "font-assets",
  }),
)
const imageAssetRoute = new Route(
  ({ request, url }) => {
    return request.destination === "image" && !url.hostname.includes("logo.clearbit.com")
  },
  new CacheFirst({
    cacheName: "image-assets",
    plugins: [
      new ExpirationPlugin({
        // Only cache requests for a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
)

registerRoute(fontAssetRoute)
registerRoute(imageAssetRoute)
