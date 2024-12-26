import { logger } from '@/lib/logger';
import { InternalServerErrorResponse, OriginalErrorResponse } from '@/lib/response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const requestData = await request.json();

    const res = await fetch(`${process.env.API_BASE_URL}/chats/messages/${id}/times`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Access ${process.env.API_KEY}`,
        'x-app-id': process.env.APP_ID ?? '',
      },
      body: JSON.stringify(requestData),
    });

    if (!res.ok) {
      return OriginalErrorResponse(res);
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error) {
    const { message } = error as { message: string };
    logger.fatal(message);
    return InternalServerErrorResponse(message);
  }
}
