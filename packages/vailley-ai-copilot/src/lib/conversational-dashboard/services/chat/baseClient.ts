import * as enums from "@/lib/conversational-dashboard/enums";
import type {
  ChatMessage,
  StreamOptions,
} from "@/lib/conversational-dashboard/models/chat";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export abstract class BaseStreamClient {
  constructor() {}

  protected async streamRequest<T>(
    body: ChatMessage,
    options: StreamOptions,
  ): Promise<void> {
    try {
      await fetchEventSource("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": enums.MimeType.JSON,
        },
        body: JSON.stringify(body),
        signal: options.signal,

        onmessage(event) {
          try {
            options.onMessage(event);
          } catch (error) {
            options.onMessage(event);
          }
        },

        onclose() {
          options.onClose?.();
        },

        onerror(error) {
          options.onError?.(error);
          throw error;
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        options.onError?.(error);
      }
      throw error;
    }
  }
}
