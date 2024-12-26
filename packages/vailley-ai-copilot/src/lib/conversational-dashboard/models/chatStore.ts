import * as enums from "@/lib/conversational-dashboard/enums";
import { create } from "zustand";
import { placeholderPrompts } from "./mockData";

interface ChatStore {
  currentQuestion: string;
  messages: enums.ChatMessageItem[];
  currentChatMessageItemIndex: number;
  prompts: string[];
  fold: boolean;
  isLoading: boolean;
  addMessage: (message: enums.ChatMessageItem) => void;
  setCurrentQuestion: (question: string) => void;
  getCurrentMessage: () => enums.ChatMessageItem | undefined;
  updateMessage: (index: number, message: enums.ChatMessageItem) => void;
  clearMessages: () => void;
  setPrompts: (prompts: string[]) => void;
  setFold: (fold: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const initIndex = -1;

export const useChatStore = create<ChatStore>((set, get) => ({
  currentQuestion: "",
  messages: [],
  currentChatMessageItemIndex: initIndex,
  prompts: placeholderPrompts,
  fold: true,
  isLoading: false,
  setCurrentQuestion: (question: string) =>
    set((state) => ({
      currentQuestion: question,
    })),
  addMessage: (message: enums.ChatMessageItem) =>
    set((state) => ({
      messages: [...state.messages, message],
      currentChatMessageItemIndex: state.currentChatMessageItemIndex + 1,
    })),
  getCurrentMessage: () => {
    const state = get();
    return state.messages[state.currentChatMessageItemIndex];
  },
  updateMessage: (index: number, message: enums.ChatMessageItem) => {
    return set((state) => ({
      messages: state.messages.map((item, i) => (i === index ? message : item)),
    }));
  },
  clearMessages: () =>
    set(() => ({
      messages: [],
      currentChatMessageItemIndex: initIndex,
      currentQuestion: "",
    })),
  setPrompts: (prompts: string[]) =>
    set(() => ({
      prompts,
    })),
  setFold: (fold: boolean) =>
    set(() => ({
      fold,
    })),
  setIsLoading: (isLoading: boolean) =>
    set(() => ({
      isLoading,
    })),
}));
