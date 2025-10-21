type FeedEntry = LoadFeedEntry

export class FeedEntriesService {
  feedEntries = $state<FeedEntry[]>([])

  constructor(initial?: FeedEntry[]) {
    if (initial) {
      initial.forEach((feedEntry) => this.feedEntries.push(feedEntry))
    }
  }

  add(feedEntries: FeedEntry | FeedEntry[]) {
    if (Array.isArray(feedEntries)) {
      feedEntries.forEach((feedEntry) => {
        if (this.feedEntries.find((savedFeedEntry) => savedFeedEntry.id === feedEntry.id)) return
        this.feedEntries.push(feedEntry)
      })
    } else {
      if (this.feedEntries.find((savedFeedEntry) => savedFeedEntry.id === feedEntries.id)) return
      this.feedEntries.push(feedEntries)
    }
  }

  remove(feedEntryId: string) {
    const feedEntryIndex = this.feedEntries.findIndex((feedEntry) => feedEntry.id === feedEntryId)
    this.feedEntries.splice(feedEntryIndex, 1)
  }

  update(feedEntry: FeedEntry) {
    const feedEntryIndex = this.feedEntries.findIndex(
      (saveFeedEntry) => saveFeedEntry.id === feedEntry.id
    )
    if (feedEntryIndex) {
      this.feedEntries[feedEntryIndex] = feedEntry
    }
  }

  find(feedEntryId: string) {
    return this.feedEntries.find((feedEntry) => feedEntry.id === feedEntryId)
  }
}
