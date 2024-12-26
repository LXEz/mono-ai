import { EventSourceMessage } from "@microsoft/fetch-event-source";
import {
  ChatMessagesDataType,
  ChatMessagesEvent,
  OpenType,
} from "../models/chatMessagesEvent";
import { echartParser } from "./echartParser";

export const isStepOpen = (event: ChatMessagesEvent) => {
  return event === ChatMessagesEvent.STEP_OPEN;
};
export const isStepMessage = (event: ChatMessagesEvent) => {
  return event === ChatMessagesEvent.STEP_MESSAGE;
};

export const isEchartOption = (data: ChatMessagesDataType) => {
  return data.name === OpenType.Echarts;
};

export const getJsonData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};

export const parser = (eventSourceMessage: EventSourceMessage) => {
  echartParser(eventSourceMessage);
};
