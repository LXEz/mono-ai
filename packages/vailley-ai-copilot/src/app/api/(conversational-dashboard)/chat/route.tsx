import {
  API_BASE_URL,
  APP_ID,
  AUTHORIZATION,
} from "@/lib/conversational-dashboard/constants/config";
import {
  CacheControl,
  ConnectionType,
  MimeType,
} from "@/lib/conversational-dashboard/enums/mime";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/chats/streaming`, {
      method: "POST",
      headers: {
        "Content-Type": MimeType.JSON,
        "x-app-id": APP_ID,
        Authorization: AUTHORIZATION,
      },
      body: JSON.stringify(body),
      signal: request.signal,
    });

    // Check the response status
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Set response headers
    const headers: Record<string, string> = {
      "Content-Type": MimeType.STREAM,
      "Cache-Control": CacheControl.NO_CACHE,
      Connection: ConnectionType.KEEP_ALIVE,
    };

    // Directly return the streaming response
    return new Response(response.body, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 },
    );
  }
}
