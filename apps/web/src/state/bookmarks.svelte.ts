type Bookmark = LoadBookmarkFlatTags

let bookmarks = $state<Bookmark[]>()

export function useBookmarks(initial?: Bookmark[]) {
  if (initial) {
    bookmarks = initial
  }

  function add(bookmark: Bookmark | Bookmark[]) {
    if (Array.isArray(bookmark)) {
      bookmarks?.push(...bookmark)
    } else {
      bookmarks?.push(bookmark)
    }
  }

  function remove(bookmarkId: string) {
    bookmarks = bookmarks?.filter(bookmark => bookmark.id !== bookmarkId)
  }

  function update(bookmark: Bookmark) {
    bookmarks = bookmarks?.map(b => (b.id === bookmark.id ? bookmark : b))
  }

  function find(bookmarkId: string) {
    if (bookmarks?.length) {
      return bookmarks?.find(bookmark => bookmark.id === bookmarkId)
    }
  }

  return {
    get bookmarks() {
      return bookmarks ?? []
    },
    set bookmarks(value: Bookmark[]) {
      bookmarks = value
    },
    add,
    remove,
    update,
    find,
  }
}
