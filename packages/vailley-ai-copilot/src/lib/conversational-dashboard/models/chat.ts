import { EventSourceMessage } from "@microsoft/fetch-event-source";

export interface StreamOptions {
  onMessage: (content: EventSourceMessage) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  signal?: AbortSignal;
}

// API error types
export class StreamError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "StreamError";
  }
}

// HTTP header definitions
export interface headers {
  Authorization?: string;
  "x-app-id": string;
  "Content-Type"?: string;
  Accept?: string;
  [key: string]: string | undefined;
}

export interface ChatMessage {
  question: string;
  history?: [];
}

export interface EchartsType {
  name: string;
  value: string;
}

export interface MessageWithTips {
  content: string;
  tips: string[];
}
