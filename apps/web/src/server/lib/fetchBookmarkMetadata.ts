import { ofetch } from "ofetch"

import metascraper from "metascraper"
import metascraperDescription from "metascraper-description"
import metascraperTitle from "metascraper-title"
import metascraperClearbit from "metascraper-clearbit"
import metascraperImage from "metascraper-image"
import metascraperLogo from "metascraper-logo"
import metascraperLogoFavicon from "metascraper-logo-favicon"
import metascraperLang from "metascraper-lang"
import metascraperPublisher from "metascraper-publisher"
import metascraperAuthor from "metascraper-author"
import metascraperFeed from "metascraper-feed"
import metascraperDate from "metascraper-date"
import metascraperUrl from "metascraper-url"
import metascraperReadability from "metascraper-readability"
import { getThumbhash } from "$server/lib/thumbhash"

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
