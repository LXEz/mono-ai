export interface ToastItem {
  id: string;
  title: string;
  description: string;
  hasShowed: boolean;
}

import { create } from 'zustand';

export interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'hasShowed' | 'id'>) => void;
}

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, hasShowed: false, id: Date.now().toString() }] })),
}));
