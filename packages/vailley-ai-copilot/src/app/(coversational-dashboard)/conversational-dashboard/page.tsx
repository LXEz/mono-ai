"use client";

import Asside from "@/components/conversational-dashboard/asside";
import MessageInput from "@/components/conversational-dashboard/messageInput";
import MessageItem from "@/components/conversational-dashboard/messageItem";
import Prompt from "@/components/conversational-dashboard/prompt";
import { useLoading } from "@/components/loading";
import { Role } from "@/lib/conversational-dashboard/enums/role";
import { parser } from "@/lib/conversational-dashboard/eventParser/parser";
import { ChatMessage } from "@/lib/conversational-dashboard/models/chat";
import { OpenType } from "@/lib/conversational-dashboard/models/chatMessagesEvent";
import { useChatStore } from "@/lib/conversational-dashboard/models/chatStore";
import { chatService } from "@/lib/conversational-dashboard/services/chat/chat";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { setLoading } = useLoading();
  const { messages, addMessage, setCurrentQuestion, isLoading, clearMessages } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const handleSend = async (content: string, echartsType?: string) => {
    setInputValue("");
    const llmMessages: ChatMessage = {
      question: echartsType ? `${content} in ${echartsType}` : content,
      history: [],
    };

    setLoading(true);

    addMessage({
      question: content,
      name: OpenType.NULL,
      data: {
        [OpenType.SelectDashboard]: echartsType,
      },
      role: Role.Assistant,
    });

    setCurrentQuestion(content);

    await chatService(llmMessages, {
      onMessage: (message: EventSourceMessage) => {
        parser(message);
      },
    });

    setLoading(false);
  };

  const handleSelect = (prompt: string) => {
    setInputValue(prompt);
    handleSend(prompt);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom of the container when messages change
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [messages]);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#212121] text-[#ececec]">
      {/* Sidebar */}
      <div className="flex flex-col h-full bg-[#171717]">
        <Asside />
      </div>
      {/* Message input and message list */}
      <div
        className={`flex flex-col flex-1 h-full min-w-0  ${
          messages.length === 0
            ? "justify-center items-center"
            : "justify-start"
        }`}
      >
        <div
          className={`${messages.length > 0 ? "my-4" : ""} flex flex-col mx-[2%]`}
        >
          <MessageInput
            onSend={handleSend}
            loading={isLoading}
            isMini={messages.length > 0}
          />
          <Prompt onSelect={handleSelect} isMini={messages.length > 0} />
        </div>

        {messages.length > 0 && (
          <div className="h-[calc(100vh-130px)] rounded-xl overflow-y-auto w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? containerRef : null}
              >
                <MessageItem
                  message={message}
                  onSend={handleSend}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
