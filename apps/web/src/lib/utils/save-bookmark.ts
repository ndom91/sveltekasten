import { db } from "$lib/prisma"
import { fetchBookmarkMetadata } from "$lib/server/fetchBookmarkMetadata"
import { PUBLIC_WORKER_URL } from "$env/static/public"

export async function saveBookmark(bookmarks: LoadBookmark[]) {
  const bookmarkData = await Promise.all(
    bookmarks.map(async (bookmark) => {
      const { imageUrl, imageBlur, metadata } = await fetchBookmarkMetadata(bookmark.url)
      return {
        ...bookmark,
        userId: "abc123",
        image: imageUrl,
        imageBlur,
        desc: metadata.description,
        title: metadata.description,
        metadata,
      }
    }),
  )

  const upsertResponse = await db.bookmark.createManyAndReturn({
    data: bookmarkData,
    skipDuplicates: true,
  })

  // Add bookmark to queue for fetching screenshot
  if (PUBLIC_WORKER_URL) {
    await fetch(`${PUBLIC_WORKER_URL}/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: bookmarkData }),
    })
  }

  return upsertResponse
}
