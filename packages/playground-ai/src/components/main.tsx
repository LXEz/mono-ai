import { DocSummary } from '@/components/docSummary';
import { EmailAssistant } from '@/components/emailAssistant';
import { FileCompare } from '@/components/fileCompare';
import { SmartQA } from '@/components/smartQA';
import { TextTranslation } from '@/components/textTranslation';
import { MenuRoute, useMenuStore } from '@/lib/models/menu';

const routes: MenuRoute = {
  smartQA: <SmartQA />,
  fileCompare: <FileCompare />,
  docSummary: <DocSummary />,
  emailAssistant: <EmailAssistant />,
  textTranslation: <TextTranslation />,
};

export function Main() {
  const { activeMenu } = useMenuStore();
  const route = routes[activeMenu];
  return route;
}
