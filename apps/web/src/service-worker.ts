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
  event.respondWith(Response.redirect("./"))

  event.waitUntil(
    (async function () {
      const url = new URL(event.request.url)
      const targetUrl = url.searchParams.get("url")

      // TODO: Get userId
      const userId = "clu6qepua0000scqbkr2t0uks"

      await fetch("/api/v1/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            url: targetUrl,
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

// self.addEventListener("fetch", (event: FetchEvent) => {
//   // Regular requests not related to Web Share Target.
//   if (event.request.method !== "POST") {
//     event.respondWith(fetch(event.request))
//     return
//   }
//
//   if (!event.clientId) return
//
//   if (
//     event.request.method === "POST" &&
//     new URL(event.request.url).pathname === "/api/v1/bookmarks/share"
//   ) {
//     event.respondWith(
//       (async () => {
//         const formData = await event.request.formData()
//         const url = formData.get("url") || ""
//         // TODO: Get userId
//         const userId = "abc123"
//         // const body = await event.request.json()
//         // const responseUrl = await fetch("/api/v1/bookmarks")
//
//         await fetch("/api/v1/bookmarks", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify([
//             {
//               url,
//               userId,
//             },
//           ]),
//         })
//         const client = await self.clients.get(event.clientId)
//         client?.postMessage({
//           msg: "Got your share!",
//           url,
//         })
//         // TODO: postMessage() back to foreground to alert success or fail
//         // https://developer.chrome.com/docs/capabilities/web-apis/web-share-target
//         return Response.redirect("/", 303)
//       })(),
//     )
//   }
// })
