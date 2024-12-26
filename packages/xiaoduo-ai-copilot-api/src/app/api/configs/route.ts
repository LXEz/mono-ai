import { logger } from '@/lib/logger';
import { InternalServerErrorResponse, OriginalErrorResponse } from '@/lib/response';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const targetHost = process.env.PROXY_TARGET_HOST as string;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  if (!type) {
    return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
  }
  console.log('Query Parameter type:', type);
  const config = {
    compose: {
      id: process.env.COMPOSE_ID,
      key: process.env.COMPOSE_KEY,
    },
    compare: {
      id: process.env.COMPARE_ID,
      key: process.env.COMPARE_KEY,
    },
    summarise: {
      id: process.env.SUMMARISE_ID,
      key: process.env.SUMMARISE_KEY,
    },
    freeplay: {
      id: process.env.FREEPLAY_ID,
      key: process.env.FREEPLAY_KEY,
    },
    freeplayTranslator: {
      id: process.env.FREEPLAYTRANSLATOR_ID,
      key: process.env.FREEPLAYTRANSLATOR_KEY,
    },
  };

  if (!(type in config)) {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }

  const { id, key } = config[type as keyof typeof config];
  try {
    const res = await fetch(`${targetHost}/applications/configs`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Access ${key}`,
        'x-app-id': id ?? '',
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
