type Feed = LoadFeed

export class FeedsService {
  feeds = $state<Feed[]>([])

  constructor(initial?: Feed[]) {
    if (initial) {
      initial.forEach((feed) => this.feeds.push(feed))
    }
  }

  add(feeds: Feed | Feed[]) {
    if (Array.isArray(feeds)) {
      feeds.forEach((feed) => {
        if (this.feeds.find((savedFeed) => savedFeed.id === feed.id)) return
        this.feeds.unshift(feed)
      })
    } else {
      if (this.feeds.find((savedFeed) => savedFeed.id === feeds.id)) return
      this.feeds.unshift(feeds)
    }
  }

  append(feeds: Feed | Feed[]) {
    if (Array.isArray(feeds)) {
      feeds.forEach((feed) => {
        if (this.feeds.find((savedFeed) => savedFeed.id === feed.id)) return
        this.feeds.push(feed)
      })
    } else {
      if (this.feeds.find((savedFeed) => savedFeed.id === feeds.id)) return
      this.feeds.push(feeds)
    }
  }

  remove(feedId: string) {
    const feedIndex = this.feeds.findIndex((feed) => feed.id === feedId)
    this.feeds.splice(feedIndex, 1)
  }

  update(feed: Feed) {
    const feedIndex = this.feeds.findIndex((savedFeed) => savedFeed.id === feed.id)
    if (feedIndex) {
      this.feeds[feedIndex] = feed
    }
  }

  find(feedId: string) {
    return this.feeds.find((feed) => feed.id === feedId)
  }
}
