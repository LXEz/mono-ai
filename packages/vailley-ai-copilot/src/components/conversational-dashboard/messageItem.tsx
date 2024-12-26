import { ChatMessageItem } from "@/lib/conversational-dashboard/models/chatMessageItem";

import { EchartsTypes } from "@/lib/conversational-dashboard/constants/echart-type.constant";
import { OpenType } from "@/lib/conversational-dashboard/models/chatMessagesEvent";
import { handleMessageWithTips } from "@/lib/conversational-dashboard/services/chat/chat";
import { convertMarkdownToHTML } from "@/lib/services/markdown";
import { cn } from "@/lib/utils";
import { EChartsOption } from "echarts";
import { ReactNode } from "react";
import Echarts from "./Echarts";
import Prompt from "./prompt";

export default function MessageItem({
  message,
  onSend,
  onSelect,
}: {
  message: ChatMessageItem;
  onSend: (content: string, echartsType?: string) => void;
  onSelect: (prompt: string, index: number) => void;
}) {
  const renderInsight = (data: Record<OpenType, unknown>) => {
    const insightData = (data[OpenType.DisplayInsight] as string) ?? "";

    return insightData ? (
      <div className="mt-10">
        <div className="text-gray-200 text-base font-bold mb-2">Insights:</div>
        <div
          className="text-gray-300 text-base whitespace-break-spaces"
          dangerouslySetInnerHTML={{
            __html: convertMarkdownToHTML(insightData),
          }}
        ></div>
      </div>
    ) : (
      ""
    );
  };

  const renderChartType = (data: Record<OpenType, unknown>) => {
    const chartType = ((data[OpenType.SelectDashboard] as string) ?? "").trim();
    return chartType ? (
      <div className="w-fit text-gray-300 bg-[#2f2f2f] p-2 rounded-lg border border-gray-700 mb-3">
        <select
          value={chartType as string}
          className="bg-[#2f2f2f] text-gray-300 focus:outline-none text-base"
          onChange={(e) => onSend(message.question ?? "", e.target.value)}
        >
          {EchartsTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    ) : (
      ""
    );
  };

  const renderQuestion = () => {
    return (
      <div>
        <h5 className="text-base font-bold text-gray-100 mb-2">Question:</h5>
        <div className="text-gray-300 text-base">{message.question}</div>
      </div>
    );
  };

  const renderInvalid = (data: Record<OpenType, unknown>) => {
    const invalidMessage = (data[OpenType.Invalid] as string) ?? "";
    const result = handleMessageWithTips(invalidMessage);

    return invalidMessage ? (
      <div>
        <h5 className="text-base font-bold text-gray-100 mb-2">
          {result.content
            ? result.content
            : "I'm sorry, I can't help with that right now. However, I can assist you with:"}
        </h5>
        <div className="text-gray-300">
          <Prompt prompts={result.tips} onSelect={onSelect} isMini={true} />
        </div>
      </div>
    ) : (
      ""
    );
  };

  const renderEcharts = (data: Record<OpenType, unknown>) => {
    const echartsData = data[OpenType.Echarts] ?? null;

    return isNoChart() && echartsData ? (
      <div className="bg-white p-3 rounded-xl w-full text-black">
        <p>{echartsData as ReactNode}</p>
      </div>
    ) : (
      echartsData && typeof echartsData === "object" && (
        <div className="bg-white p-3 rounded-xl w-full text-black">
          <Echarts data={{ option: echartsData as EChartsOption }} />
        </div>
      )
    );
  };

  const isInvalid = () => {
    const data = message.data as Record<OpenType, unknown>;
    return !!data[OpenType.Invalid];
  };

  const isNoChart = () => {
    const data = message.data as Record<OpenType, unknown>;
    const chartType = ((data[OpenType.SelectDashboard] as string) ?? "").trim();
    return chartType.length === 0;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-[#1a1a1a] text-gray-200 p-5 rounded-2xl mb-10 mx-[2%] min-h-[calc(100vh-257px)]",
        isInvalid() && "min-h-0",
      )}
    >
      <div className="mb-5">{renderQuestion()}</div>

      {renderChartType(message.data as Record<OpenType, unknown>)}
      {renderEcharts(message.data as Record<OpenType, unknown>)}
      {renderInsight(message.data as Record<OpenType, unknown>)}
      {renderInvalid(message.data as Record<OpenType, unknown>)}
    </div>
  );
}
