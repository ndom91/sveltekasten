import { persisted } from 'svelte-local-storage-store';
import type { Bookmark } from "$zod"

// Search
const searching = $state(false);
let searchQuery = $state('');
const searchRecents = persisted<string[]>('svelte:recent-searches', []);

// Sidebars
let metadataSidebarOpen = $state(false);
let metadataSidebarData = $state<Bookmark>({})
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
    updateSearchQuery: (e: string): void => searchQuery = e,

    // UI Elements
    get metadataSidebarOpen() { return metadataSidebarOpen },
    get metadataSidebarData() { return metadataSidebarData },
    get metadataSidebarEditMode() { return metadataSidebarEditMode },
    get userSidebarOpen() { return userSidebarOpen },
    get quickAddOpen() { return quickAddOpen },
    toggleMetadataSidebar: (target?: boolean): void => metadataSidebarOpen = target ? target : !metadataSidebarOpen,
    toggleMetadataSidebarEditMode: (target?: boolean): void => metadataSidebarEditMode = target ? target : !metadataSidebarEditMode,
    setMetadataSidebarData: (data: Bookmark): void => metadataSidebarData = data,
    toggleUserSidebar: (): void => userSidebarOpen = !userSidebarOpen,
    toggleQuickAdd: (target?: boolean): void => quickAddOpen = target ? target : !quickAddOpen,
  }
}
