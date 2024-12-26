// Base template interface
export interface Template {
  knowledgeBase: KnowledgeBase[];
  greeting: string;
  name: string;
}

// Knowledge base interface
export interface KnowledgeBase {
  id: string;
  name: 'en' | 'zh';
  prompts: string[];
  children: KnowledgeBaseChild[];
}

// Knowledge base child interface
export interface KnowledgeBaseChild {
  id: string;
  name: string;
  prompts: string[];
}

export type TemplateConfigResponse = Template;

import { config, MenuType } from '@/lib/services';

import { create } from 'zustand';

export type RenderTemplate = Record<
  'en' | 'zh',
  {
    id: string;
    name: KnowledgeBaseChild['name'];
    prompts: KnowledgeBaseChild['prompts'];
  }[]
>;

export function extractTemplateFromResponse(original: TemplateConfigResponse): RenderTemplate {
  const alias: Record<string, 'en' | 'zh'> = {
    en: 'en',
    zh: 'zh',
    cn: 'zh',
  };

  // Create an object to store the result
  const result: RenderTemplate = {
    en: [],
    zh: [],
  };

  try {
    // Process each knowledge base
    original.knowledgeBase.forEach((kb) => {
      // Get all prompts from children
      kb.children.forEach((child) => {
        const aliasName = alias[kb.name];
        result[aliasName].push({
          id: child.id,
          name: child.name,
          prompts: child.prompts,
        });
      });
    });

    return result;
  } catch (error) {
    console.error('Error extracting template from response:', error);
    return {
      en: [],
      zh: [],
    };
  }
}

export interface TemplateStore {
  template: RenderTemplate | null;
  setTemplate: (template: RenderTemplate | null) => void;
  flushTemplate: (type: MenuType) => Promise<void>;
  clearTemplate: () => void;
}

export const useTemplateStore = create<TemplateStore>()((set) => ({
  template: null,
  setTemplate: (template) => set({ template }),
  flushTemplate: async (type: MenuType) => {
    const res = await config(type);
    set({ template: extractTemplateFromResponse(res.data!) });
  },
  clearTemplate: () => set({ template: null }),
}));
