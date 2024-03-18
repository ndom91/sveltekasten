import { capitalize } from "$lib/utils"

export const parsePocketBookmarks = (doc: Document) => {
  const dataElements = doc.querySelectorAll("body ul > li") as NodeListOf<
    HTMLElement | HTMLDListElement
  >
  return Array.from(dataElements)
    .map((element) => {
      // @ts-expect-error No DOM interface for DT, MDN says its a `HTMLElement`s
      if (element.tagName === "LI" && element.firstElementChild.attributes.href) {
        const title = element.textContent?.replaceAll("\n", "").trim().substring(0, 190)
        // @ts-expect-error No DOM interface for DT, MDN says its a `HTMLElement`s
        const url = element.firstElementChild?.attributes?.href?.value?.trim()
        // @ts-expect-error No DOM interface for DT, MDN says its a `HTMLElement`s
        const date = element.firstElementChild?.attributes?.time_added?.value?.trim()
        // @ts-expect-error No DOM interface for DT, MDN says its a `HTMLElement`s
        const tags = element.firstElementChild?.attributes?.tags?.value
          .trim()
          .split(",")
          .map((tag: string) => capitalize(tag.trim()))

        return {
          title,
          url,
          createdAt: parseInt(date) ? new Date(parseInt(date) * 1000).toISOString() : 0,
          tags,
        }
      }
    })
    .filter(Boolean)
}
