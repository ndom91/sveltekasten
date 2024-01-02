import { persisted } from 'svelte-local-storage-store';
import type { Bookmark } from '$lib/types';

// Search
// let searchOverlayOpen = $state(false);
const searching = $state(false);
let searchQuery = $state('');
const searchRecents = persisted<string[]>('svelte:recent-searches', []);

// Sidebars
let metadataSidebarOpen = $state(false);
let metadataSidebarData = $state<Bookmark | Record<string, unknown>>({})
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
    updateSearchQuery: (e: string) => searchQuery = e,

    // UI Elements
    get metadataSidebarOpen() { return metadataSidebarOpen },
    get metadataSidebarData() { return metadataSidebarData },
    get metadataSidebarEditMode() { return metadataSidebarEditMode },
    get userSidebarOpen() { return userSidebarOpen },
    get quickAddOpen() { return quickAddOpen },
    toggleMetadataSidebar: (target?: boolean) => metadataSidebarOpen = target ? target : !metadataSidebarOpen,
    toggleMetadataSidebarEditMode: (target?: boolean) => metadataSidebarEditMode = target ? target : !metadataSidebarEditMode,
    // toggleMetadataSidebarEditMode: (target?: boolean, test) => console.log('toggle.target', { target, test }),
    setMetadataSidebarData: (data: Bookmark) => metadataSidebarData = data,
    toggleUserSidebar: () => userSidebarOpen = !userSidebarOpen,
    toggleQuickAdd: (target?: boolean) => quickAddOpen = target ? target : !quickAddOpen,
  }
}
