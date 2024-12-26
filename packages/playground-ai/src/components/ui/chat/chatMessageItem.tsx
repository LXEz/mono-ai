import { useToast } from '@/hooks/use-toast';
import { ChatMessageItem as ChatMessageItemType } from '@/lib/models/chat/chatMessages';
import userUtils from '@/lib/models/user';
import { cn } from '@/lib/utils';
import { Copy, ImageDown } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

export function ChatMessageItem({
  message,
  isLoadingPlaceHolder = false,
}: {
  message: ChatMessageItemType;
  isLoadingPlaceHolder?: boolean;
}) {
  const { toast } = useToast();
  const extractActionData = (originalData: string) => {
    // Match all pairs of $$icon$$ label
    const matches = originalData.matchAll(/\$\$(&#\d+;&#\d+;)\s*(.*?)(?=\$\$|$)/g);
    const results = [];

    for (const match of matches) {
      results.push({
        icon: match[1].trim(),
        label: match[2].trim(),
      });
    }

    // Get content without $$ markers
    const cleanContent = originalData.replace(/:?\s*\$\$.*/, '').trim();

    const hasActions = originalData.includes('$$');
    return {
      actions: results.length > 0 ? results : null,
      cleanContent: hasActions ? cleanContent : originalData,
    };
  };

  // const test =
  //   '言或直接输入语言名称：$$&#127482;&#127480; 英文$$&#127470;&#127475; 印地语$$&#127465;&#127466; 德语$$&#127464;&#127475; 中文$$&#127471;&#127477; 日语$$&#127472;&#127479; 韩语$$';
  const { actions, cleanContent } = useMemo(() => extractActionData(message.content), [message.content]);

  console.log(actions, '--', cleanContent);

  const canRenderCopy = useMemo(
    () => message.role === 'assistant' && !isLoadingPlaceHolder,
    [message.role, isLoadingPlaceHolder],
  );

  const renderCopy = () => {
    return (
      <div
        className="w-full flex items-center justify-end mt-2 gap-2 cursor-pointer
     text-gray-500 hover:text-blue-500"
        onClick={() => {
          try {
            navigator.clipboard.writeText(message?.content || '');
            toast({
              title: 'Successfully copied',
            });
          } catch (error) {
            console.error(error);
            toast({
              title: 'Failed to copy',
              variant: 'destructive',
            });
          }
        }}
      >
        <Copy size={20} />
        <span>Copy</span>
      </div>
    );
  };

  const renderImageDown = () => {
    return <ImageDown size={20} className="text-[#8e54e9] hover:cursor-pointer mt-2 mb-6" />;
  };

  const renderAction = () => {
    const decodeIcon = (text: string) => {
      // 处理混合输入，将字符串按 HTML 实体分割并逐个处理
      return text
        .split(/(&#{1}\d+;)/)
        .map((part) => {
          if (part.startsWith('&#')) {
            // 处理 HTML 实体编码部分
            const code = parseInt(part.replace(/[&#;]/g, ''));
            return String.fromCodePoint(code);
          }
          // 保留非实体编码的部分
          return part;
        })
        .join('');
    };

    return (
      <>
        {actions && (
          <div className="flex flex-wrap items-center gap-4 mt-4 max-w-[70%]">
            {actions.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <span className="">{decodeIcon(item.icon)}</span>
                <span className="text-sm">{decodeIcon(item.label)}</span>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={cn(
        'w-full mb-4 flex flex-col',
        message.role === 'assistant' ? 'justify-start items-start' : 'justify-end items-end',
      )}
    >
      <div className={cn('flex items-center gap-2', message.role === 'assistant' ? 'justify-start' : 'justify-end')}>
        {message.role !== 'assistant' && (
          <div className="order-2 ml-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={userUtils.getUser()?.avatar || '/default-avatar.png'}
                alt="User Avatar"
                width={32}
                height={32}
              />
            </div>
            <span className="text-sm text-gray-500 text-bold">{userUtils.getUser()?.nickname}</span>
          </div>
        )}

        <div
          className={cn(
            'p-4 rounded-lg max-w-[70%] shadow-sm',
            message.role === 'assistant' ? 'bg-white border border-gray-100 shadow-sm' : 'bg-[#7C3AED] text-white',
            'w-fit',
          )}
        >
          <div className="w-full">{cleanContent}</div>
          {canRenderCopy && renderCopy()}
        </div>
      </div>
      {canRenderCopy && renderImageDown()}
      {canRenderCopy && renderAction()}
    </div>
  );
}
