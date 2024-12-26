import { pipleLineHandler } from "@/lib/conversational-dashboard/eventParser/dataHandler";
import { ChatMessageItem } from "@/lib/conversational-dashboard/models/chatMessageItem";
import {
  ChatMessagesDataType,
  ChatMessagesEvent,
  OpenType,
} from "@/lib/conversational-dashboard/models/chatMessagesEvent";
import { useChatStore } from "@/lib/conversational-dashboard/models/chatStore";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { getJsonData } from "./parser";

interface ParserContext {
  state: ChatMessagesEvent;
  currentOpenType: OpenType;
  cacheData: string;
  result: Record<string, unknown>;
  mesages: ChatMessageItem[];
}

export const parserContext: ParserContext = {
  state: ChatMessagesEvent.NULL,
  currentOpenType: OpenType.NULL,
  cacheData: "",
  result: {},
  mesages: [],
};

const handleStepOpen = (data: string) => {
  const jsonData = getJsonData(data) as ChatMessagesDataType;
  parserContext.currentOpenType = jsonData.name;
};

const handleStepMessage = (data: string) => {
  if (data === "") {
    if (parserContext.cacheData.length > 0) {
      data = "\n";
    } else {
      return;
    }
  }

  const currentMessage = useChatStore.getState().getCurrentMessage();

  parserContext.cacheData += data;

  useChatStore
    .getState()
    .updateMessage(useChatStore.getState().currentChatMessageItemIndex, {
      ...currentMessage,
      question: currentMessage?.question,
      name: parserContext.currentOpenType,
      data: {
        ...(currentMessage?.data as Record<string, unknown>),
        [parserContext.currentOpenType]: parserContext.cacheData,
      },
    });
};

const handleStepClose = () => {
  const parsedData =
    parserContext.currentOpenType !== OpenType.DisplayInsight
      ? pipleLineHandler(parserContext.cacheData)
      : parserContext.cacheData;

  parserContext.mesages.push({
    name: parserContext.currentOpenType,
    data: parsedData,
  });
  const currentMessage = useChatStore.getState().getCurrentMessage();
  useChatStore
    .getState()
    .updateMessage(useChatStore.getState().currentChatMessageItemIndex, {
      ...currentMessage,
      name: parserContext.currentOpenType,
      data: {
        ...(currentMessage?.data as Record<string, unknown>),
        [parserContext.currentOpenType]: parsedData,
        done: parserContext.currentOpenType === OpenType.Echarts,
      },
    });
  const done = parserContext.currentOpenType === OpenType.Echarts;

  parserContext.currentOpenType = OpenType.NULL;
  parserContext.cacheData = "";
};

export const echartParser = (eventSourceMessage: EventSourceMessage) => {
  const { event: oriEvent, data } = eventSourceMessage;

  const event = oriEvent as ChatMessagesEvent;

  switch (event) {
    case ChatMessagesEvent.STEP_OPEN:
      handleStepOpen(data);
      break;
    case ChatMessagesEvent.STEP_MESSAGE:
      handleStepMessage(data);
      break;

    case ChatMessagesEvent.MESSAGE:
      handleStepMessage(data);
      break;
    case ChatMessagesEvent.STEP_CLOSE:
      handleStepClose();
      break;
  }
};
