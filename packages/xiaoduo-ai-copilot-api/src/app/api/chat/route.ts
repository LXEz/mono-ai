import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { InternalServerErrorResponse } from '@/lib/response';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const targetHost = process.env.PROXY_TARGET_HOST as string;

/**
 *  test url: http://localhost:3000/api/chat
 *
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const result = await auth(req);

    if (result.errcode === 0) {
      const newUrl = `${targetHost}${req.url}`;

      logger.info({}, `proxy to url:${newUrl}`);

      return fetch(newUrl, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const { message } = error as { message: string };

    logger.fatal({}, `Wechat login call /connect/qrconnect message:${message}`);

    return InternalServerErrorResponse(message);
  }
}
