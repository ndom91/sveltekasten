/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope

self.addEventListener("message", (event: MessageEvent) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})

self.addEventListener("fetch", (event: FetchEvent) => {
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
        // TODO: postMessage() back to foreground to alert success or fail
        // https://developer.chrome.com/docs/capabilities/web-apis/web-share-target
        return Response.redirect("/", 303)
      })(),
    )
  }
})
