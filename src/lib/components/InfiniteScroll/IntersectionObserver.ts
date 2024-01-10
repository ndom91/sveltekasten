type IntersectionObserverProps = {
  fetch: () => void
  element: HTMLElement
}

export const intersectionObserver = ({ fetch, element }: IntersectionObserverProps): IntersectionObserver | null => {
  if (element) {
    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          await fetch();
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
    return observer
  }
  return null
};
