import {
  ChatMessage,
  StreamOptions,
} from "@/lib/conversational-dashboard/models/chat";
import { BaseStreamClient } from "./baseClient";

class StreamClient extends BaseStreamClient {
  constructor() {
    super();
  }

  async streamChat(
    messages: ChatMessage,
    options: StreamOptions,
  ): Promise<void> {
    await this.streamRequest(messages, options);
  }
}

export const streamClient = new StreamClient();
