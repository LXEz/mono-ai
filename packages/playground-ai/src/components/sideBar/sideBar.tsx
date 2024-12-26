'use client';

import logo from '@/assets/dzfm-logo.png';
import AskFreely from '@/assets/icon-ask-freely.svg';
import FileCompare from '@/assets/icon-compare-files.svg';
import DocSummary from '@/assets/icon-summary.svg';

import { UploadComponent } from '@/components/ui/upload';
import i18n from '@/i18n';
import { useFileStore } from '@/lib/models/files';
import { MenuRouteKey, useMenuStore } from '@/lib/models/menu';
import { useSidebarStore } from '@/lib/models/sidebar';
import { handleUpload } from '@/lib/pdfParse';
import { cn, rem } from '@/lib/utils';
import { Languages, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function SideBar() {
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: (texColor: string) => <AskFreely size={20} color={texColor} />,
      label: t('menuItems.smartQA'),
      path: 'smartQA',
    },
    {
      icon: (texColor: string) => <FileCompare size={20} color={texColor} />,
      label: t('menuItems.fileCompare'),
      path: 'fileCompare',
      upload: true,
      fileNumber: 2,
      maxSize: 320 * 1024,
      dialogDescription: 'Upload two PDF files. Playground AI will analyze them and answer your questions.',
    },
    {
      icon: (texColor: string) => <DocSummary size={20} color={texColor} />,
      label: t('menuItems.docSummary'),
      path: 'docSummary',
      upload: true,
      maxSize: 640 * 1024,
      fileNumber: 1,
      dialogDescription: 'Upload any PDF file, and Playground AI will analyze it, providing you with a summary.',
    },
    {
      icon: (texColor: string) => <Mail size={20} color={texColor} />,
      label: t('menuItems.emailAssistant'),
      path: 'emailAssistant',
    },
    {
      icon: (texColor: string) => <Languages size={20} color={texColor} />,
      label: t('menuItems.textTranslation'),
      path: 'textTranslation',
    },
  ];

  // Add language state
  const [language, setLanguage] = React.useState<'zh' | 'en'>(i18n.language as 'zh' | 'en');

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang as 'zh' | 'en');
  };
  const { activeMenu, setActiveMenu } = useMenuStore();
  const { isOpen } = useSidebarStore();
  const updateFileProgress = useFileStore((state) => state.updateFileProgress);
  const onLoaded = useFileStore((state) => state.onLoaded);

  const renderDefaultItem = (item: (typeof menuItems)[0]) => {
    return (
      <motion.div layout className="flex items-center gap-3 overflow-hidden ">
        {item.icon('#8e54e9')}
        <motion.span
          animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? '80%' : '0px' }}
          className={cn('overflow-hidden', isOpen ? 'w-[80%] h-[24px]' : 'w-[0px] ')}
        >
          <span className="text-black w-[260px] h-[24px] block">{item.label}</span>
        </motion.span>
      </motion.div>
    );
  };

  const renderWithUpload = (item: (typeof menuItems)[0]) => {
    return (
      <UploadComponent
        description={item.dialogDescription ?? ''}
        maxSize={item.maxSize ?? 1000000000}
        fileNumber={item.fileNumber ?? 2}
        onUpload={(files) => {
          handleUpload(
            files,
            (info, extra) => {
              console.log(info);
              updateFileProgress(info.id, info.progress, extra);
            },
            (file) => {
              onLoaded(file);
            },
          );
        }}
        onPressUploadButton={() => {
          setActiveMenu(item.path as MenuRouteKey);
        }}
        triggerChildren={renderDefaultItem(item)}
      />
    );
  };

  return (
    <div className={cn(`w-[350px] flex flex-col h-full `)}>
      {/* Logo section */}
      <div className="flex items-center justify-between mb-8">
        <Image src={logo} alt="logo" width={120} height={30} />
      </div>
      {/* Menu items */}
      <div className="space-y-2 h-full">
        {menuItems.map((item, index) => (
          <motion.div
            animate={{
              width: isOpen ? rem(350) : rem(50),
              height: isOpen ? rem(46) : rem(50),
              padding: isOpen ? rem(12) : rem(0),
              paddingLeft: isOpen ? rem(12) : rem(14),
            }}
            key={index}
            className={cn(
              'flex  items-center gap-3  h-[46px] p-3 rounded-lg bg-white/60 hover:bg-white cursor-pointer',
              activeMenu === item.path ? 'bg-white text-[#8e54e9]' : '',
              isOpen ? 'w-[350px] h-[46px] p-[12px] pl-[12px]' : 'w-[40px] h-[40px] p-[0px] justify-center ',
            )}
            onClick={() => {
              if (item.upload) {
                return;
              }
              setActiveMenu(item.path as MenuRouteKey);
            }}
          >
            {item.upload ? renderWithUpload(item) : renderDefaultItem(item)}
          </motion.div>
        ))}
      </div>
      {/* Language toggle */}
      <motion.div layout className={cn('mt-auto pt-4 flex  text-sm   text-black w-[30px]', !isOpen ? 'flex-col ' : '')}>
        <motion.button
          layout
          className={cn(
            'px-2 py-1 rounded transition-colors ',
            language !== 'zh' ? 'bg-white/70' : ' bg-white',
            'rounded-lg ',
            !isOpen ? 'rounded-b-none' : 'rounded-r-none',
          )}
          onClick={() => switchLanguage('zh')}
        >
          {t('chinese')}
        </motion.button>
        <motion.button
          layout
          className={cn(
            'px-2 py-1 rounded transition-colors',
            language !== 'en' ? 'bg-white/70' : ' bg-white',
            'rounded-lg ',
            !isOpen ? 'rounded-t-none' : 'rounded-l-none',
          )}
          onClick={() => switchLanguage('en')}
        >
          {t('english')}
        </motion.button>
      </motion.div>
    </div>
  );
}
