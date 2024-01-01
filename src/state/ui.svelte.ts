import { persisted } from 'svelte-local-storage-store';

// Search
const searching = $state(false);
// let searchOverlayOpen = $state(false);
let searchQuery = $state('');
const searchRecents = persisted<string[]>('svelte:recent-searches', []);

// Sidebars
let metadataSidebarOpen = $state(false);
let userSidebarOpen = $state(false);

export function createUI() {
  return {
    // Search
    get searching() { return searching },
    get searchQuery() { return searchQuery },
    get searchRecents() { return searchRecents },
    // @ts-expect-error
    updateSearchQuery: (e) => searchQuery = e,

    // UI Elements
    get metadataSidebarOpen() { return metadataSidebarOpen },
    get userSidebarOpen() { return userSidebarOpen },
    toggleMetadataSidebar: () => metadataSidebarOpen = !metadataSidebarOpen,
    toggleUserSidebar: () => userSidebarOpen = !userSidebarOpen,
  }
}
