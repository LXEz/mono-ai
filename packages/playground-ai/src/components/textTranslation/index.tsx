'use client';

import { ChatInput } from '@/components/ui/chat/chatInput';
import { ChatMessages } from '@/components/ui/chat/chatMessages';
import { ChatTitle } from '@/components/ui/chat/chatTitle';
import { useClearTemplate } from '@/hooks/useClearTemplate';
import { MenuType } from '@/lib/enums/menu';
import { useChatMessageStore } from '@/lib/models/chat/chatMessages';
import { useEffect } from 'react';

export function TextTranslation() {
  const flushMessage = useChatMessageStore((state) => state.flushMessage);

  const isLoading = useChatMessageStore((state) => state.isLoading);
  useEffect(() => {
    flushMessage(MenuType.FREEPLAY_TRANSLATOR);
  }, [flushMessage]);

  useClearTemplate();

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col px-[150px]">
        <ChatTitle
          refresh={() => {
            if (isLoading) return;
            flushMessage(MenuType.FREEPLAY_TRANSLATOR);
          }}
          isLoading={isLoading}
          title="menuItems.textTranslation"
        />
      </div>

      {/* Chat container */}
      <ChatMessages />
      {/* Input area */}
      <ChatInput menuItem={MenuType.FREEPLAY_TRANSLATOR} />
    </div>
  );
}
