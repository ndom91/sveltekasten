import { persisted } from 'svelte-local-storage-store';

// Search
const searching = $state(false);
// let searchOverlayOpen = $state(false);
let searchQuery = $state('');
const searchRecents = persisted<string[]>('svelte:recent-searches', []);

// Sidebars
let metadataSidebarOpen = $state(false);
let metadataSidebarData = $state({})
let userSidebarOpen = $state(false);
let quickAddOpen = $state(false);

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
    get metadataSidebarData() { return metadataSidebarData },
    get userSidebarOpen() { return userSidebarOpen },
    get quickAddOpen() { return quickAddOpen },
    toggleMetadataSidebar: (target?: boolean) => metadataSidebarOpen = target ? target : !metadataSidebarOpen,
    // @ts-expect-error
    setMetadataSidebarData: (data) => metadataSidebarData = data,
    toggleUserSidebar: () => userSidebarOpen = !userSidebarOpen,
    toggleQuickAdd: (target?: boolean) => quickAddOpen = target ? target : !quickAddOpen
  }
}
