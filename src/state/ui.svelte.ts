import type { Category, Tag } from "$zod"

type MetadataSidebarData = {
  bookmark?: LoadBookmarkResult
  categories?: Category[]
  tags?: Tag[]
}

// Search
const searching = $state(false)
let searchQuery = $state("")

// Feed Page
let showUnreadOnly = $state(false)

// Sidebars
let metadataSidebarOpen = $state(false)
let metadataSidebarData = $state<MetadataSidebarData>({
  bookmark: undefined,
  categories: [],
  tags: [],
})
let metadataSidebarEditMode = $state(false)
let userSidebarOpen = $state(false)
let quickAddOpen = $state(false)

// AI Features
let textToSpeechContent = $state("")
let textToSpeechAudioBlob = $state("")
let textToSpeechLoading = $state(false)
let summarizationLoading = $state(false)
let summarizationContent = $state("")
let aiFeaturesPreferences = $state({
  tts: true,
  summarization: true,
  transcription: true,
})

export function useInterface() {
  return {
    // Search
    get searching() {
      return searching
    },
    get searchQuery() {
      return searchQuery
    },
    set searchQuery(query) {
      searchQuery = query
    },
    updateSearchQuery: (e: string): string => (searchQuery = e),

    // Feed Page
    get showUnreadOnly() {
      return showUnreadOnly
    },
    set showUnreadOnly(query) {
      showUnreadOnly = query
    },

    // AI
    get textToSpeechContent() {
      return textToSpeechContent
    },
    set textToSpeechContent(query) {
      textToSpeechContent = query
    },
    get textToSpeechAudioBlob() {
      return textToSpeechAudioBlob
    },
    set textToSpeechAudioBlob(query) {
      textToSpeechAudioBlob = query
    },
    get textToSpeechLoading() {
      return textToSpeechLoading
    },
    set textToSpeechLoading(query) {
      textToSpeechLoading = query
    },
    get aiFeaturesPreferences() {
      return aiFeaturesPreferences
    },
    set aiFeaturesPreferences(query) {
      console.log("aiSet.query", query)

      aiFeaturesPreferences = query
    },

    // Bart Summarization
    get summarizationLoading() {
      return summarizationLoading
    },
    set summarizationLoading(query) {
      summarizationLoading = query
    },
    get summarizationContent() {
      return summarizationContent
    },
    set summarizationContent(query) {
      summarizationContent = query
    },

    // UI Elements
    get metadataSidebarOpen() {
      return metadataSidebarOpen
    },
    get metadataSidebarData() {
      return metadataSidebarData
    },
    get metadataSidebarEditMode() {
      return metadataSidebarEditMode
    },
    get userSidebarOpen() {
      return userSidebarOpen
    },
    get quickAddOpen() {
      return quickAddOpen
    },
    set quickAddOpen(data) {
      quickAddOpen = data
    },
    toggleMetadataSidebar: (target?: boolean): boolean =>
      (metadataSidebarOpen = target ?? !metadataSidebarOpen),
    toggleMetadataSidebarEditMode: (target?: boolean): boolean =>
      (metadataSidebarEditMode = target ?? !metadataSidebarEditMode),
    setMetadataSidebarData: (data: MetadataSidebarData): MetadataSidebarData =>
      (metadataSidebarData = data),
    toggleUserSidebar: (): boolean => (userSidebarOpen = !userSidebarOpen),
    toggleQuickAdd: (target?: boolean): boolean => (quickAddOpen = target ?? !quickAddOpen),
  }
}
