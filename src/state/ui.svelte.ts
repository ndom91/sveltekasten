import { persisted } from 'svelte-local-storage-store';
import type { Bookmark, Category, Tag } from "$zod"

type MetadataSidebarData = {
  bookmark: Bookmark,
  categories?: Category[],
  tags?: Tag[]
}

// Search
const searching = $state(false);
let searchQuery = $state('');
const searchRecents = persisted<string[]>('svelte:recent-searches', []);

// Sidebars
let metadataSidebarOpen = $state(false);
let metadataSidebarData = $state<MetadataSidebarData>({
  bookmark: {
    id: "",
    title: "",
    url: "",
    image: "",
    imageBlur: "",
    desc: "",
    categoryId: "",
    metadata: {},
    userId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  categories: [],
  tags: []
})
let metadataSidebarEditMode = $state(false)
let userSidebarOpen = $state(false);
let quickAddOpen = $state(false);

export function useInterface() {
  return {
    // Search
    get searching() { return searching },
    get searchQuery() { return searchQuery },
    set searchQuery(query) { searchQuery = query },
    get searchRecents() { return searchRecents },
    updateSearchQuery: (e: string): string => searchQuery = e,

    // UI Elements
    get metadataSidebarOpen() { return metadataSidebarOpen },
    get metadataSidebarData() { return metadataSidebarData },
    get metadataSidebarEditMode() { return metadataSidebarEditMode },
    get userSidebarOpen() { return userSidebarOpen },
    get quickAddOpen() { return quickAddOpen },
    toggleMetadataSidebar: (target?: boolean): boolean => metadataSidebarOpen = target ? target : !metadataSidebarOpen,
    toggleMetadataSidebarEditMode: (target?: boolean): boolean => metadataSidebarEditMode = target ? target : !metadataSidebarEditMode,
    setMetadataSidebarData: (data: MetadataSidebarData): MetadataSidebarData => metadataSidebarData = data,
    toggleUserSidebar: (): boolean => userSidebarOpen = !userSidebarOpen,
    toggleQuickAdd: (target?: boolean): boolean => quickAddOpen = target ? target : !quickAddOpen,
  }
}
