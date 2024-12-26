'use client';

import { Template } from '@/components/template';
import { MenuItems } from '@/lib/enums/menu';
import { useMenuStore } from '@/lib/models/menu';
import { useTemplateStore } from '@/lib/models/template';
import { MenuType } from '@/lib/services';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const menuItemToMenuType: Record<MenuItems, MenuType> = {
  [MenuItems.smartQA]: 'freeplay',
  [MenuItems.fileCompare]: 'compare',
  [MenuItems.docSummary]: 'summarise',
  [MenuItems.emailAssistant]: 'compose',
  [MenuItems.textTranslation]: 'freeplayTranslator',
};

export default function Right({ className }: { className: string }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const activeMenu = useMenuStore((state) => state.activeMenu);
  const flushTemplate = useTemplateStore((state) => state.flushTemplate);
  const template = useTemplateStore((state) => state.template);
  const templateData = useMemo(() => template?.[currentLanguage as 'en' | 'zh'], [template, currentLanguage]);

  useEffect(() => {
    flushTemplate(menuItemToMenuType[activeMenu]);
  }, [flushTemplate, activeMenu]);

  return (
    <div className={cn(className)}>
      <div className="flex flex-col gap-2 text-white mb-4">
        <span>{t('smartTemplates')}</span>
      </div>
      {templateData && templateData.map((template) => <Template template={template} key={template.id} />)}
    </div>
  );
}
