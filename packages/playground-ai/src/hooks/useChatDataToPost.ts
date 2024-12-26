import { PostChatMessage, useChatMessageStore } from '@/lib/models/chat/chatMessages';
import { useMemo } from 'react';

export function useChatDataToPost(): PostChatMessage {
  const messages = useChatMessageStore((state) => state.messages);

  const history = useMemo(() => {
    return messages.history?.reduce<{ question: string; answer: string }[]>((acc, curr, index) => {
      if (curr.role === 'user' && messages.history?.[index + 1]) {
        const nextMessage = messages.history[index + 1];
        if (nextMessage.role === 'assistant') {
          acc.push({
            question: curr.content,
            answer: nextMessage.content,
          });
        }
      }
      return acc;
    }, []);
  }, [messages.history]);

  const lastUserMessage = messages.history?.findLast((msg) => msg.role === 'user');

  return {
    history: history || [],
    question: lastUserMessage?.content || '',
  };
}
