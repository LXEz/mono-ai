'use client';

import { ChatMessageItem } from '@/components/ui/chat/chatMessageItem';
import { useChatMessageStore } from '@/lib/models/chat/chatMessages';
import { useEffect, useRef } from 'react';

export function ChatMessages() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messages = useChatMessageStore((state) => state.messages);
  const isLoading = useChatMessageStore((state) => state.isLoading);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="flex-1 bg-gray-50 overflow-auto max-h-[400px] py-2 px-[100px]">
      {messages.history?.map((message) => <ChatMessageItem key={message.id} message={message} />)}
      {isLoading && (
        <div className="flex items-center bg-white rounded-[6px] space-x-2 p-4 w-fit">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
        </div>
      )}
    </div>
  );
}
