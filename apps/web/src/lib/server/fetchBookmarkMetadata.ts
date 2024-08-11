import metascraper from "metascraper"
import metascraperAuthor from "metascraper-author"
import metascraperDate from "metascraper-date"
import metascraperDescription from "metascraper-description"
import metascraperFeed from "metascraper-feed"
import metascraperImage from "metascraper-image"
import metascraperLang from "metascraper-lang"
import metascraperPublisher from "metascraper-publisher"
import metascraperReadability from "metascraper-readability"
import metascraperTitle from "metascraper-title"
import metascraperUrl from "metascraper-url"
import { ofetch } from "ofetch"
import { getThumbhash } from "$lib/server/thumbhash"

const metascraperClient = metascraper([
  metascraperDescription(),
  metascraperTitle(),
  metascraperImage(),
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
  let b64Thumbhash = ""

  try {
    b64Thumbhash = await getThumbhash(metadata.image)
  } catch (error) {
    console.error("Failed to get thumbhash", String(error))
  }

  return {
    imageUrl,
    imageBlur: b64Thumbhash,
    metadata,
  }
}
