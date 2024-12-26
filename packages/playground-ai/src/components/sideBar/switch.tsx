'use client';

import { useSidebarStore } from '@/lib/models/sidebar';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function Switch() {
  const { isRightOpen, toggleRight } = useSidebarStore();
  const { t } = useTranslation();

  return (
    <div className="flex justify-end items-center gap-2">
      {/* Switch button */}
      <button
        type="button"
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full',
          isRightOpen ? 'bg-[#64b5f6]' : 'bg-gray-200',
        )}
        onClick={() => toggleRight()}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition',
            isRightOpen ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>

      {/* Switch label */}
      <span className="text-sm font-medium">{t('smartTemplates')}</span>
    </div>
  );
}
