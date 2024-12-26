import { logger } from '@/lib/logger';
import { InternalServerErrorResponse, OriginalErrorResponse } from '@/lib/response';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/applications/configs`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Access ${process.env.API_KEY}`,
        'x-app-id': process.env.APP_ID ?? '',
      },
    });

    if (!res.ok) {
      return OriginalErrorResponse(res);
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message } = error as { message: string };
    logger.fatal(message);
    return InternalServerErrorResponse(message);
  }
}
