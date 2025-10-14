import { parseFeed } from "@rowanmanning/feed-parser"
import { Feed } from "@rowanmanning/feed-parser/lib/feed/base.js"
import debugFactory from "./log.js"

const debug = debugFactory("backend:fetch-feed")

interface FetchFeed {
  url: string
  lastFetched?: Date | null
}

export const fetchFeed = async ({
  url,
  lastFetched = null,
}: FetchFeed): Promise<Feed | undefined> => {
  // Disable TLS verification for RSS feeds that changed domains and redirect
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

  const headers: Record<string, string> = {
    "User-Agent": "BriefButler/1.0 (+https://github.com/ndom91/briefkastenhq)",
    "Accept-Encoding": "gzip",
  }

  if (lastFetched) {
    headers["If-Modified-Since"] = lastFetched?.toISOString()
  }

  const response = await fetch(url, {
    headers,
  })

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1"

  if (response.status === 304) {
    debug(`Feed not modified since last fetch - ${url}`)
    return
  }

  const xml = await response.text()
  return parseFeed(xml)
}
