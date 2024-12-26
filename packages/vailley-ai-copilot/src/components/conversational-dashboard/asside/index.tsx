import Clear from "@/assets/clear.svg";
import Fold from "@/assets/fold.svg";
import Unfold from "@/assets/unfold.svg";
import { ChatMessageItem } from "@/lib/conversational-dashboard/models/chatMessageItem";
import { OpenType } from "@/lib/conversational-dashboard/models/chatMessagesEvent";
import { useChatStore } from "@/lib/conversational-dashboard/models/chatStore";
import { useEffect, useRef, useState } from "react";

export default function Asside() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    getCurrentMessage,
    clearMessages,
    messages,
    setFold,
    fold,
    isLoading,
  } = useChatStore();
  const currentMessage =
    getCurrentMessage() ?? ({ data: {} } as ChatMessageItem);

  const renderControls = () => (
    <div className="flex justify-between mt-2 mb-8">
      <button
        className="hover:bg-white/10 rounded"
        onClick={() => {
          setFold(!fold);
          setIsCollapsed(!isCollapsed);
        }}
      >
        {isCollapsed ? (
          <Fold className="w-5 h-5 text-gray-400" />
        ) : (
          <Unfold className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {!isCollapsed && (
        <button
          className={`hover:bg-white/10 rounded ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (isLoading) return;
            clearMessages();
          }}
        >
          <Clear className="w-5 h-5 text-gray-400" />
        </button>
      )}
    </div>
  );

  const renderQuestion = () => {
    return (
      <div>
        <h5 className="text-sm font-bold text-gray-400 mb-2">Question:</h5>
        <div className="text-gray-400 text-sm">{currentMessage?.question}</div>
      </div>
    );
  };

  const renderSQL = () => {
    const SQL = (currentMessage?.data as Record<string, unknown>)[
      OpenType.GenerateSQLWithQuestion
    ] as string;
    return SQL ? (
      <div className="mt-4">
        <h5 className="text-sm font-bold text-gray-400 mb-2">SQL:</h5>
        <div className="text-gray-400 text-sm">{SQL}</div>
      </div>
    ) : (
      ""
    );
  };

  const renderSQLData = () => {
    const SQLData = (currentMessage?.data as Record<string, unknown>)[
      OpenType.SQLData
    ] as string | undefined;
    return SQLData ? (
      <div className="mt-4">
        <h5 className="text-sm font-bold text-gray-400 mb-2">Data Set:</h5>
        <div className="text-gray-400 text-sm">{SQLData}</div>
      </div>
    ) : (
      ""
    );
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom of the container when messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentMessage?.data]);

  const renderDetails = () => {
    return (
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[calc(100vh-100px)]"
      >
        {renderQuestion()}
        {renderSQL()}
        {renderSQLData()}
      </div>
    );
  };
  return (
    <div
      className={`p-4 h-full transition-all duration-300 overflow-hidden ${
        isCollapsed ? "w-13" : "w-64"
      }`}
    >
      {renderControls()}
      {!isCollapsed && messages.length > 0 && renderDetails()}
    </div>
  );
}
