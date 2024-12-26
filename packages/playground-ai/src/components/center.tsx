'use client';

import { Main } from '@/components/main';
import i18n from '@/i18n';
import { useSidebarStore } from '@/lib/models/sidebar';
import { cn, rem } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Right from './right';
import { Switch } from './sideBar/switch';

export default function Center({ className }: { className: string }) {
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize i18n on client side
    if (!i18n.isInitialized) {
      // i18n.init();
    }
  }, []);

  const { isRightOpen, toggle, isOpen } = useSidebarStore();

  const renderTitle = () => {
    return (
      <div className="flex justify-end items-center text-2xl w-full text-center font-bold  text-white">
        <div className="flex-1">{t('title')}</div>
        <div className="text-white  w-[300px] p-4">
          <h2 className="text-lg font-medium ">
            <Switch />
          </h2>
        </div>
      </div>
    );
  };

  const renderMain = () => {
    return (
      <div className="w-full h-full flex flex-col  items-center z-10">
        <div className="w-full flex flex-col max-h-[620px]  rounded-[24px] bg-[#fafafa] p-4">
          <div className="">
            <ChevronLeft
              className={cn(
                'cursor-pointer text-[#8957e9]  bg-white rounded-full p-1 relative left-[-24px] top-[78px] h-[32px] w-[32px]',
                isOpen ? '' : 'rotate-180 transition-all duration-300',
              )}
              size={24}
              onClick={toggle}
            />
          </div>
          <Main />
        </div>
      </div>
    );
  };

  return (
    <div className={cn(`  pl-0  h-full flex  flex-col w-full `, className)}>
      {renderTitle()}

      <div className="flex w-full flex-1 ">
        {renderMain()}

        <motion.div
          animate={{ width: isRightOpen ? rem(300) : rem(0), opacity: isRightOpen ? 1 : 0 }}
          className={cn(
            '  bg-transparent flex flex-col h-[620px]  overflow-y-scroll  ml-2',
            isRightOpen ? 'w-[300px]' : 'w-0 opacity-0',
          )}
        >
          <Right className="bg-transparent w-[240px]" />
        </motion.div>
      </div>
    </div>
  );
}
