import SendIcon from "@/assets/send.svg";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: (content: string) => void;
  loading?: boolean;
  isMini?: boolean;
}

export default function MessageInput({ onSend, loading, isMini }: Props) {
  const [localValue, setLocalValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSend) {
      onSend(localValue ?? "");
      setLocalValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-2 relative">
        <textarea
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
          }}
          className={cn(
            "flex-1 py-4 pl-6 pr-16 bg-[#2f2f2f] text-white rounded-[32px] resize-none focus:outline-none text-base placeholder-gray-400 overflow-y-auto mr-1",
            isMini && "py-2",
          )}
          placeholder="Type your message here..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && localValue) {
              handleSubmit(e);
            }
          }}
        />
        <button
          disabled={loading || !localValue}
          type="submit"
          className={cn(
            "absolute right-4 bottom-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:opacity-70 text-white bg-[#676767] cursor-pointer",
            (loading || !localValue) && "cursor-not-allowed opacity-50",
            isMini && "w-6 h-6 bottom-2 right-3",
          )}
        >
          <SendIcon className={cn("w-8 h-8", isMini && "w-6 h-6")} />
        </button>
      </div>
    </form>
  );
}
