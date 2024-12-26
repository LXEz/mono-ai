import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useChatMessageStore } from '@/lib/models/chat/chatMessages';
import { KnowledgeBaseChild } from '@/lib/models/template';

// import Copy from '@/assets/icon-copy.svg';
import { Copy } from 'lucide-react';

interface TemplateProps {
  template: {
    name: KnowledgeBaseChild['name'];
    prompts: KnowledgeBaseChild['prompts'];
  };
}

export function Template({ template }: TemplateProps) {
  const { toast } = useToast();
  const setGlobalInputValue = useChatMessageStore((state) => state.setGlobalInputValue);
  const handleCopy = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setGlobalInputValue(text);
    } catch (error) {
      console.error('Failed to copy to clipboard', error);
      toast({
        title: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="mb-2">
        <AccordionTrigger className="hover:no-underline bg-[#fafafa] p-2 rounded-t-[6px]">
          {template.name}
        </AccordionTrigger>
        <AccordionContent className="bg-[#fafafa] p-2 rounded-b-[6px]">
          {template.prompts.map((prompt, index) => (
            <div
              key={index}
              className="p-4 mb-2 bg-white rounded-[6px] border border-[#dddddd] flex gap-2 justify-between items-start"
            >
              <div className="flex-1">{prompt}</div>
              <button onClick={() => handleCopy(prompt)} className="p-1 hover:bg-gray-100 rounded">
                <Copy size={20} className="text-[#8e54e9]" />
              </button>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
