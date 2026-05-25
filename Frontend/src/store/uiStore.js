import { create } from 'zustand'

export const useUIStore = create((set) => ({
  isSongSearchDrawerOpen: false,

  openSongSearch: () => set({ isSongSearchDrawerOpen: true }),
  closeSongSearch: () => set({ isSongSearchDrawerOpen: false }),
  toggleSongSearch: () => set((s) => ({ isSongSearchDrawerOpen: !s.isSongSearchDrawerOpen })),
}))
