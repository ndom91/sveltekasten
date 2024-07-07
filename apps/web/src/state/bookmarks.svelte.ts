import { SvelteMap } from "svelte/reactivity"

type Bookmark = LoadBookmarkFlatTags

const bookmarks = new SvelteMap<string, Bookmark>()

export function useBookmarks(initial?: Bookmark[]) {
  if (initial) {
    initial.forEach((bk) => bookmarks.set(bk.id, bk))
  }

  function add(bookmark: Bookmark | Bookmark[]) {
    if (Array.isArray(bookmark)) {
      bookmark.forEach((bk) => bookmarks.set(bk.id, bk))
    } else {
      bookmarks.set(bookmark.id, bookmark)
    }
  }

  function remove(bookmarkId: string) {
    bookmarks.delete(bookmarkId)
  }

  function update(bookmark: Bookmark) {
    bookmarks.set(bookmark.id, bookmark)
  }

  function find(bookmarkId: string) {
    return bookmarks.get(bookmarkId)
  }

  return {
    get bookmarks() {
      return Array.from(bookmarks.values())
    },
    set bookmarks(value: Bookmark[]) {
      value.forEach((bk) => bookmarks.set(bk.id, bk))
    },
    add,
    remove,
    update,
    find,
  }
}
