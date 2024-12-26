import { ChatMessageItem } from '@/lib/models/chat/chatMessages';
import { MenuType } from '@/lib/services';

const defaultChatData: Record<MenuType, ChatMessageItem[]> = {
  freeplay: [
    {
      id: '1',
      role: 'assistant',
      content: '您好，我是小舵，您专属的AI 助手。有什么我能帮您的吗？',
    },
    {
      id: '2',
      role: 'assistant',
      content: '请在下方输入您的提示，我将尽力为您提供所需信息或帮助。',
    },
    {
      id: '3',
      role: 'user',
      content: '请在下方输入您的提示，我将尽力为您提供所需信息或帮助。',
    },
    {
      id: '4',
      role: 'assistant',
      content: '请在下方输入您的提示，我将尽力为您提供所需信息或帮助。',
    },
  ],
  compose: [],
  compare: [],
  summarise: [],
  freeplayTranslator: [
    {
      id: '1',
      role: 'assistant',
      content:
        '请提供您想让我翻译的文本和目标语言。您可以选择以下语言或直接输入语言名称：$$&#127482;&#127480;　英１１文$$&#127470;&#127475; 印地语$$&#127465;&#127466; 德语$$&#127464;&#127475; 中文$$&#127471;&#127477; 日语$$&#127472;&#127479; 韩语$$',
    },
  ],
};

export default defaultChatData;
