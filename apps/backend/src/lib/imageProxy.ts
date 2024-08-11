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
  let responseBody = response.body
  let responseStatus = response.status

  let data = await clonedResponse.blob()

  // Attempt retry if IPX doesn't handle image request properly
  if (!response.ok) {
    const extractedFaviconUrl = targetUrl.match(/\/_\/(https:\/\/.*)/)
    if (extractedFaviconUrl?.[1]) {
      const rawFaviconResponse = await fetch(extractedFaviconUrl[1], {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        }
      })
      const clonedRawFaviconResponse = rawFaviconResponse.clone()

      responseBody = rawFaviconResponse.body
      responseStatus = rawFaviconResponse.status

      data = await clonedRawFaviconResponse.blob()
    }
  }

  if (data.type.match(/^image/)) {
    cache.set(targetUrl, data)
  }

  // TODO: Clone response body from raw retry to immediately return that
  return new Response(responseBody, {
    status: responseStatus,
    headers: {
      "x-cache": "MISS",
      "x-image-proxy": "0.0.1",
      "Content-Type": data.type,
      'cache-control': 'max-age=31536000, public, s-maxage=31536000',
    }
  })
}
