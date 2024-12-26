'use client';

import AskFreely from '@/assets/icon-ask-freely.svg';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ChatTitle({ refresh, isLoading, title }: { refresh: () => void; isLoading: boolean; title: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between pb-4 mb-8 w-full h-[72px] p-[24px] bg-white rounded-lg">
      <div className="flex items-center gap-2">
        <AskFreely size={20} color="#8e54e9" />
        <h1 className="text-xl font-medium">{t(title)}</h1>
      </div>
      <RefreshCw
        size={20}
        onClick={refresh}
        className={cn('cursor-pointer', isLoading ? 'opacity-50 cursor-not-allowed' : '')}
      />
    </div>
  );
}
