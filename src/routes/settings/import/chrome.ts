export const parseChromeBookmarks = (doc: Document) => {
  const dataElements = doc.querySelectorAll("dl dt") as NodeList
  return Array.from(dataElements)
    .map((element) => {
      if (element.tagName === "DT" && element.firstElementChild.attributes.href) {
        const title = element.textContent?.replaceAll("\n", "").trim().substring(0, 190)
        const url = element.firstElementChild?.attributes?.href?.value?.trim()
        const date = element.firstElementChild?.attributes?.add_date?.value?.trim()

        return {
          title,
          url,
          createdAt: parseInt(date) ? new Date(parseInt(date) * 1000).toISOString() : 0,
        }
      }
    })
    .filter(Boolean)
}
