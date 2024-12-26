import { ChatMessagesResponse, PostChatMessage } from '@/lib/models/chat/chatMessages';
import { TemplateConfigResponse } from '@/lib/models/template';
import httpClient from '@/lib/services/httpClient';
import { AxiosRequestConfig } from 'axios';

// Define the chat types based on the provided URLs
export type MenuType = 'freeplay' | 'compose' | 'compare' | 'summarise' | 'freeplayTranslator';

type ChatConfig = AxiosRequestConfig & {
  'x-chat-sid'?: string;
  'user_id'?: string;
};

// Function to handle chat requests
export async function chat(type: MenuType, message: PostChatMessage, config?: ChatConfig) {
  // Construct the URL based on the chat type
  const url = `/api/chats?name=${type}`;
  return await httpClient.post<ChatMessagesResponse>(url, message, config);
}

export async function config(type: MenuType, config?: ChatConfig) {
  const url = `/api/configs?name=${type}`;
  return await httpClient.get<TemplateConfigResponse>(url, config);
}
