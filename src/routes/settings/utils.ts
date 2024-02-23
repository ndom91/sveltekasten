/*
 * Based on format in Microsoft Bookmark File "Spec"
 * - https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)
 */
export const exportBookmarks = (bookmarks: LoadBookmarkFlatTags[]) => {
  const date = new Date()

  // Generate HTML file based on the following bookmark format template
  let output = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
    <!-- This is an automatically generated file.
    It will be read and overwritten.
    DO NOT EDIT! -->
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <Title>Bookmarks</Title><H1>Bookmarks</H1>
<DL><p>
<DT><H3 FOLDED ADD_DATE="${(new Date().getTime() / 1000).toFixed(0)}">Briefkasten Bookmarks</H3>
<DL><p>`

  bookmarks.forEach((bookmark) => {
    output += `\n<DT><A HREF="${bookmark.url}" PRIVATE="0" ADD_DATE="${(new Date(bookmark.createdAt).getTime() / 1000).toFixed(0)}" LAST_MODIFIED="${(new Date(bookmark.updatedAt).getTime() / 1000).toFixed(0)}" ${bookmark.tags.length ? 'TAGS="' + bookmark.tags.map((tag) => tag.name).join(",") + '"' : ""}> ${bookmark.title} </A>`
  })

  output += `\n</DL><p>\n</DL><p>`

  // Download the generated HTML string by creating an anchor element and clicking it programmatically
  const el = document.createElement("a")
  el.download = `briefkasten_bookmarks_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}.html`

  const bookmarksExport = new Blob([output], { type: "text/html" })
  el.href = window.URL.createObjectURL(bookmarksExport)
  el.click()
}
