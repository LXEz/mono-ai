import PromptIcon from "@/assets/prompt.svg";
import { useChatStore } from "@/lib/conversational-dashboard/models/chatStore";
import { cn } from "@/lib/utils";

interface PromptProp {
  onSelect?: (prompt: string, index: number) => void;
  isMini?: boolean;
  prompts?: string[];
}

export default function Prompt({
  onSelect,
  isMini = false,
  prompts,
}: PromptProp) {
  const defaultPrompts = useChatStore((state) => state.prompts);

  return (
    <div className="mt-2">
      {(prompts ?? defaultPrompts).map((prompt, index) => (
        <div
          key={index}
          onClick={() => onSelect?.(prompt, index)}
          className={cn(
            "flex text-gray-400 text-sm items-center hover:bg-[#2f2f2f] hover:text-gray-200 cursor-pointer transition-colors duration-200 border-b-[1px] border-solid border-[#ffffff1a] justify-start whitespace-pre-wrap rounded-lg px-2.5 py-3 text-start",
            isMini && "py-[10px]",
          )}
        >
          <div className="mr-3">
            <PromptIcon className={cn("w-6 h-6", isMini && "w-4 h-4")} />
          </div>
          <span>{prompt}</span>
        </div>
      ))}
    </div>
  );
}
