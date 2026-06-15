import type { Context } from "hono"
import { createIPX, createIPXWebServer, ipxFSStorage, ipxHttpStorage } from "ipx"
import { LRUCache } from "lru-cache"
import { actions } from "./constants.js"
import debugFactory from "./log.js"
import { db } from "../plugins/prisma.js"
import { screenshotQueue } from "../plugins/queue.js"

const debug = debugFactory("backend:image-proxy")

const ipx = createIPX({
  storage: ipxFSStorage(),
  httpStorage: ipxHttpStorage({
    allowAllDomains: true,
    ignoreCacheControl: true,
  }),
})

const cache = new LRUCache<string, Blob>({
  max: 500,
})

const screenshotRepairCache = new LRUCache<string, true>({
  max: 1000,
  ttl: 10 * 60 * 1000,
})

const extractSourceImageUrls = (targetUrl: string) => {
  const match = targetUrl.match(/\/(?:_|[^/]+)\/(https?:\/\/.+)$/)
  const rawImageUrl = match?.[1]
  if (!rawImageUrl || rawImageUrl.length > 4096) {
    return []
  }

  const imageUrls = [rawImageUrl]
  try {
    const decodedImageUrl = decodeURIComponent(rawImageUrl)
    if (decodedImageUrl !== rawImageUrl) {
      imageUrls.push(decodedImageUrl)
    }
  } catch {
    // Keep the raw URL for exact DB lookup when malformed percent-encoding is present.
  }

  return imageUrls
}

const shouldRepairImage = (status: number) => status === 404 || status >= 500

const enqueueScreenshotRepair = async (targetUrl: string) => {
  const imageUrls = extractSourceImageUrls(targetUrl)
  if (!imageUrls.length || imageUrls.some((imageUrl) => screenshotRepairCache.has(imageUrl))) {
    return
  }

  for (const imageUrl of imageUrls) {
    screenshotRepairCache.set(imageUrl, true)
  }

  const bookmarks = await db.bookmark.findMany({
    where: {
      OR: imageUrls.map((imageUrl) => ({ image: imageUrl })),
    },
    select: {
      id: true,
      url: true,
      userId: true,
    },
    take: 20,
  })

  if (!bookmarks.length) {
    debug("No bookmark found for failed proxied image", { imageUrl: imageUrls[0] })
    return
  }

  for (const bookmark of bookmarks) {
    if (screenshotQueue.length() > 100) {
      debug("Skipping screenshot repair because the queue is backed up", {
        queueLength: screenshotQueue.length(),
      })
      return
    }

    debug("Queueing screenshot repair for failed proxied image", {
      bookmarkId: bookmark.id,
      imageUrl: imageUrls[0],
    })

    void screenshotQueue
      .push({
        action: actions.ADD_SCREENSHOT,
        data: {
          url: bookmark.url,
          userId: bookmark.userId,
        },
      })
      .catch((error) => console.error(error))
  }
}

export const imageProxyHandler = async (c: Context) => {
  const targetUrl = c.req.raw.url.replace(/\/img/, "")

  const cachedResponse = cache.get(targetUrl)

  if (cachedResponse) {
    return new Response(cachedResponse, {
      status: 200,
      headers: {
        "x-cache": "HIT",
        "x-image-proxy": "0.0.1",
        "Content-Type": cachedResponse.type,
        "cache-control": "max-age=31536000, public, s-maxage=31536000",
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
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        },
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

  if (shouldRepairImage(responseStatus)) {
    void enqueueScreenshotRepair(targetUrl).catch((error) => {
      console.error(error)
    })
  }

  // TODO: Clone response body from raw retry to immediately return that
  return new Response(responseBody, {
    status: responseStatus,
    headers: {
      "x-cache": "MISS",
      "x-image-proxy": "0.0.1",
      "Content-Type": data.type,
      "cache-control": "max-age=31536000, public, s-maxage=31536000",
    },
  })
}
