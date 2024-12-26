import {
  ChatMessage,
  MessageWithTips,
  StreamOptions,
} from "@/lib/conversational-dashboard/models/chat";
import { streamClient } from "./streamClient";

export function chatService(messages: ChatMessage, options: StreamOptions) {
  return streamClient.streamChat(messages, options);
}

export function handleMessageWithTips(input: string): MessageWithTips {
  const parts = input.split("$$");

  if (parts.length < 2) {
    return { content: input, tips: [] };
  }

  const content = parts[0] + parts[parts.length - 1];

  const tips = parts.slice(1, parts.length - 1);

  return { content, tips };
}
