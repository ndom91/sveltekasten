type IntersectionObserverProps = {
  fetch: () => Promise<void>
  element: HTMLElement
}

export const infiniteScroll = ({
  fetch,
  element,
}: IntersectionObserverProps): IntersectionObserver | null => {
  if (element) {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          await fetch()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(element)
    return observer
  }
  return null
}
