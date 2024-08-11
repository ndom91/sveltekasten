type Bookmark = LoadBookmarkFlatTags

export class BookmarksService {
  bookmarks = $state<Bookmark[]>([])

  constructor(initial?: Bookmark[]) {
    if (initial) {
      initial.forEach((bk) => this.bookmarks.push(bk))
    }
  }

  add(bookmark: Bookmark | Bookmark[]) {
    if (Array.isArray(bookmark)) {
      bookmark.forEach((bk) => {
        if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bk.id)) return
        this.bookmarks.unshift(bk)
      })
    } else {
      if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bookmark.id)) return
      this.bookmarks.unshift(bookmark)
    }
  }

  append(bookmark: Bookmark | Bookmark[]) {
    if (Array.isArray(bookmark)) {
      bookmark.forEach((bk) => {
        if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bk.id)) return
        this.bookmarks.push(bk)
      })
    } else {
      if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bookmark.id)) return
      this.bookmarks.push(bookmark)
    }
  }

  remove(bookmarkId: string) {
    const bookmarkIndex = this.bookmarks.findIndex((bk) => bk.id === bookmarkId)
    this.bookmarks.splice(bookmarkIndex, 1)
  }

  update(bookmark: Bookmark) {
    const bookmarkIndex = this.bookmarks.findIndex((bk) => bk.id === bookmark.id)
    if (bookmarkIndex) {
      this.bookmarks[bookmarkIndex] = bookmark
    }
  }

  upsert(bookmark: Bookmark) {
    const bookmarkIndex = this.bookmarks.findIndex((bk) => bk.id === bookmark.id)
    if (bookmarkIndex) {
      this.bookmarks[bookmarkIndex] = bookmark
    } else {
      this.bookmarks.push(bookmark)
    }
  }

  find(bookmarkId: string) {
    return this.bookmarks.find((bk) => bk.id === bookmarkId)
  }
}
