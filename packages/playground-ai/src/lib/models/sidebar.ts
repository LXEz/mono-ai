import { create } from 'zustand';

// Define store state interface
interface SidebarState {
  isOpen: boolean;
  isRightOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setRightOpen: (open: boolean) => void;
  toggleRight: () => void;
}

// Create sidebar store with state management
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  isRightOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open: boolean) => set({ isOpen: open }),
  setRightOpen: (open: boolean) => set({ isRightOpen: open }),
  toggleRight: () => set((state) => ({ isRightOpen: !state.isRightOpen })),
}));
