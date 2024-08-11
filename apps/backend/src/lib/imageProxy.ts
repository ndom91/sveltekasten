import { type Context } from "hono"
import {
  createIPX,
  createIPXWebServer,
  ipxFSStorage,
  ipxHttpStorage,
} from 'ipx';
import { LRUCache } from "lru-cache";

const ipx = createIPX({
  storage: ipxFSStorage(),
  httpStorage: ipxHttpStorage({
    allowAllDomains: true,
    ignoreCacheControl: true,
  }),
});

const cache = new LRUCache({
  max: 500,
});

export const imageProxyHandler = async (c: Context) => {
  const targetUrl = c.req.raw.url.replace(/\/img/, "")

  const cachedResponse = cache.get(targetUrl) as Blob | undefined

  if (cachedResponse) {
    return new Response(cachedResponse, {
      status: 200,
      headers: {
        "x-cache": "HIT",
        "x-image-proxy": "0.0.1",
        "Content-Type": cachedResponse.type,
        'cache-control': 'max-age=31536000, public, s-maxage=31536000',
      },
    })
  }

  const response = await createIPXWebServer(ipx)(new Request(targetUrl))

  const clonedResponse = response.clone()
  let data = await clonedResponse.blob()

  if (!response.ok) {
    // Favicons with mimetype 'image/vnd.microsoft.icon' are not supported by IPX / sharp
    // So we'll fetch it ourselves and cache it
    const extractedFaviconUrl = targetUrl.match(/\/_\/(https:\/\/.*)/)
    if (extractedFaviconUrl?.[1]) {
      const rawFaviconResponse = await fetch(extractedFaviconUrl[1])
      data = await rawFaviconResponse.blob()
    }
  }

  if (data.type.match(/^image/)) {
    cache.set(targetUrl, data)
  }

  // TODO: Clone response body from raw retry to immediately return that
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText
  })
}
