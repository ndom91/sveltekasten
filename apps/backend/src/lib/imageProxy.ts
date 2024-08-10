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
  }),
});

const cache = new LRUCache({
  max: 200,
});

export const imageProxyHandler = async (c: Context) => {
  const targetUrl = c.req.raw.url.replace(/\/img/, "")

  const cachedResponse = cache.get(targetUrl)
  if (cachedResponse) {
    return new Response(cachedResponse as Blob, {
      status: 200,
      headers: {
        "x-cache": "HIT",
        "Content-Type": "image/jpeg",
        'cache-control': 'max-age=31536000, public, s-maxage=31536000',
      },
    })
  }

  const response = await createIPXWebServer(ipx)(new Request(targetUrl))

  const clonedResponse = response.clone()
  const data = await clonedResponse.blob()
  cache.set(targetUrl, data)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText
  })
}
