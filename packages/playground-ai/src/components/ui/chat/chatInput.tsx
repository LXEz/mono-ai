'use client';

import { useToast } from '@/hooks/use-toast';
import { useChatDataToPost } from '@/hooks/useChatDataToPost';
import { MenuType } from '@/lib/enums/menu';
import { useChatMessageStore } from '@/lib/models/chat/chatMessages';
import { chat } from '@/lib/services';
import { cn } from '@/lib/utils';
import { SendHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ChatInput({ menuItem }: { menuItem: MenuType }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const globalInputValue = useChatMessageStore((state) => state.globalInputValue);
  const pushMessage = useChatMessageStore((state) => state.pushMessage);
  const toggleLoading = useChatMessageStore((state) => state.toggleLoading);
  const isLoading = useChatMessageStore((state) => state.isLoading);
  const { history } = useChatDataToPost();
  const { toast } = useToast();
  useEffect(() => {
    setInputValue(globalInputValue);
  }, [globalInputValue, setInputValue]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    pushMessage({
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    });
    toggleLoading();

    setInputValue('');

    try {
      console.log(history, inputValue);
      const response = await chat(menuItem, {
        history,
        question: inputValue,
      });

      pushMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: response.data?.messages[0].answer || '',
      });

      toggleLoading();
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
      toggleLoading();
    }
  };
  return (
    <div className="mb-8 mt-4 w-full flex justify-center px-[100px]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder={t('inputPlaceholder')}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={(e) => {
            if (isLoading) return;
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          className="w-full p-4 pr-12 rounded-[60px]  border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md hover:shadow-sm transition-shadow"
        />
        <button
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors',
            isLoading && 'animate-pulse cursor-not-allowed',
          )}
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
