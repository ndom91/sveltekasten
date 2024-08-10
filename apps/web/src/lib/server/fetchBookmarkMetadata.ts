import metascraper from "metascraper"

import metascraperAuthor from "metascraper-author"
import metascraperClearbit from "metascraper-clearbit"
import metascraperDate from "metascraper-date"
import metascraperDescription from "metascraper-description"
import metascraperFeed from "metascraper-feed"
import metascraperImage from "metascraper-image"
import metascraperLang from "metascraper-lang"
import metascraperLogo from "metascraper-logo"
import metascraperLogoFavicon from "metascraper-logo-favicon"
import metascraperPublisher from "metascraper-publisher"
import metascraperReadability from "metascraper-readability"
import metascraperTitle from "metascraper-title"
import metascraperUrl from "metascraper-url"
import { ofetch } from "ofetch"
import { getThumbhash } from "$lib/server/thumbhash"

const metascraperClient = metascraper([
  metascraperDescription(),
  metascraperTitle(),
  metascraperClearbit(),
  metascraperLogo(),
  metascraperImage(),
  metascraperLogoFavicon(),
  metascraperLang(),
  metascraperPublisher(),
  metascraperAuthor(),
  metascraperFeed(),
  metascraperReadability(),
  metascraperDate(),
  metascraperUrl(),
])

export const fetchBookmarkMetadata = async (url: string) => {
  const bookmarkPageText = await ofetch(url)
  const metadata = await metascraperClient({ html: bookmarkPageText, url })
  const imageUrl = metadata.image ? metadata.image : (metadata.logo as string)

  // Continue bookmark saving when sharp or anything chokes on an image
  let b64Thumbhash = ""
  try {
    b64Thumbhash = await getThumbhash(imageUrl)
  } catch (error) {
    console.error("Failed to get thumbhash", String(error))
  }

  return {
    imageUrl,
    imageBlur: b64Thumbhash,
    metadata,
  }
}
