import { create } from 'zustand'

export const useSetlistStore = create((set) => ({
  setlists: [],
  currentSetlist: null,
  setSetlists: (setlists) => set({ setlists }),
  setCurrentSetlist: (setlist) => set({ currentSetlist: setlist }),
}))
