/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope

const manifest = self.__WB_MANIFEST
console.log("manifest", manifest)

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})

self.addEventListener("fetch", (event: FetchEvent) => {
  // Regular requests not related to Web Share Target.
  if (event.request.method !== "POST") {
    event.respondWith(fetch(event.request))
    return
  }

  if (!event.clientId) return

  if (
    event.request.method === "POST" &&
    new URL(event.request.url).pathname === "/api/v1/bookmarks/share"
  ) {
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
