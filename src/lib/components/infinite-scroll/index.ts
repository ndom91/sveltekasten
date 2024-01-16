type IntersectionObserverProps = {
  fetch: () => void
  element: HTMLElement
}

export const infiniteScroll = ({
  fetch,
  element,
}: IntersectionObserverProps): IntersectionObserver | null => {
  if (element) {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          fetch()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(element)
    return observer
  }
  return null
}
