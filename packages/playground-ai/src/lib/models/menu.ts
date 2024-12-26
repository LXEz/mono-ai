import { create } from 'zustand';
import { MenuItems } from '../enums/menu';

export type MenuRouteKey = keyof typeof MenuItems;

export type MenuRoute = Record<MenuRouteKey, React.ReactNode>;

interface MenuState {
  activeMenu: MenuRouteKey;
  setActiveMenu: (menu: MenuRouteKey) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  activeMenu: MenuItems.smartQA,
  setActiveMenu: (menu: MenuRouteKey) => set({ activeMenu: menu }),
}));
