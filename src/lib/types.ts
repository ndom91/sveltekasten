type BookmarkMetadata = {
  url: string
  date: string
  lang: string
  logo: {
    url: string
    size: number
    type: string
    color: string
    width: number
    height: number
    palette: string[]
    size_pretty: string
    background_color: string
    alternative_color: string
  }
  audio: string | null
  image: {
    url: string
    size: number
    type: string
    color: string
    width: number
    height: number
    palette: string[]
    size_pretty: string
    background_color: string
    alternative_color: string
  }
  title: string
  video: string | null
  author: string | null
  publisher: string
  description: string
}

export type Bookmark = {
  title: string
  desc: string
  url: string | undefined
  image: string | undefined
  category: string | undefined
  tags: string[] | undefined
  userId: string
  updatedAt: string
  createdAt: string
  metadata: BookmarkMetadata
}
