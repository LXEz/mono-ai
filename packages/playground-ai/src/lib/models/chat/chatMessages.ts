export interface ChatMessagePlaceholderItem {
  icon?: string;
  text: string;
}
type ChatMessageRole = 'user' | 'assistant';
export interface ChatMessageItem {
  role: ChatMessageRole;
  content: string;
  id?: string;
  isGreeting?: boolean;
  placeholder?: ChatMessagePlaceholderItem[];
}

export type PostChatMessage = {
  question: string;
  history: { question: string; answer: string }[];
};

export interface ChatMessages {
  id?: string;
  answer?: string;
  question?: string;
  history?: ChatMessageItem[];
}

export interface ChatMessagesResponse {
  messages: Omit<ChatMessages, 'history'>[];
  sourceDocument: null;
  ui: null;
  restRes: {
    generated_question: null;
    inputs_outputs: string[];
  };
}

import { MenuType } from '@/lib/services';
import { create } from 'zustand';
import defaultChatData from './deaftChatData';

export interface ChatMessageStore {
  isLoading: boolean;
  globalInputValue: string;
  messages: ChatMessages;
  toggleLoading: () => void;
  flushMessage: (menuItem: MenuType) => void;
  setGlobalInputValue: (value: string) => void;
  pushMessage: (message: ChatMessageItem) => void;
}

export const useChatMessageStore = create<ChatMessageStore>()((set) => ({
  isLoading: false,
  globalInputValue: '',
  messages: [],
  toggleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
  flushMessage: (menuItem: MenuType) => {
    const chatData = defaultChatData[menuItem];
    set({ messages: { history: chatData } });
  },
  setGlobalInputValue: (value: string) => {
    set({ globalInputValue: value });
  },
  pushMessage: (message: ChatMessageItem) => {
    set((state) => ({
      messages: { ...state.messages, history: [...(state.messages.history || []), message] },
    }));
  },
}));
