import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { InternalServerErrorResponse, OriginalErrorResponse } from '@/lib/response';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


//const getChatAnswer = async (
//  question: string,
//): Promise<Models.ChatAPIResponse> => {
//  try {
//    //const url = `${process.env.NEXT_PUBLIC_SUPERALPHA_API}${CONSTANTS.SUPERALPHA_CHAT}`;
//    const url = `${targetHost}`;
//    const reqHead = {
//      "Content-Type": "application/json",
//      "x-app-id": `${process.env.NEXT_PUBLIC_SENTIMENT_APP_ID}`,
//      Authorization: `${CONSTANTS.SUPERALPHA_CHAT_Access} ${process.env.NEXT_PUBLIC_SENTIMENT_API_KEY}`,
//    };
//    const reqBody: Models.ChatAPIBody = {
//      question,
//    };
//    const res = await fetch(url, {
//      method: "POST",
//      headers: reqHead,
//      //mode: 'no-cors',
//      body: JSON.stringify(reqBody),
//    });
//    //debugger;
//    if (!res.ok) {
//      console.info(` getChatAnswer Fail : ${JSON.stringify(reqBody)}`);
//      const data = await res.json();
//      throw new Error(data.reason);
//    }
//    const data = (await res.json()) as Models.ChatAPIResponse;
//    return data;
//  } catch (error: any) {
//    console.error(`Failed to getChatAnswer: ${error.message}`);
//    return { error: CONSTANTS.SUPERALPHACHAT_ERROR };
//  }
//};


const targetHost = process.env.PROXY_TARGET_HOST as string;

/**
 *  test url: http://localhost:3000/api/chats
 *
 * @param req
 * @returns
 */

export async function POST(request: NextRequest) {
  try {
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
    const requestData = await request.json();
    const wechatAuth = await auth(request);

    if (wechatAuth.errcode === 0) {
      const res = await fetch(`${targetHost}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Access ${key}`,
          'x-app-id': id ?? '',
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        return OriginalErrorResponse(res);
      }

      return new NextResponse(res.body, {
        status: 200,
        statusText: res.statusText,
        headers: res.headers,
      });
    }

    return NextResponse.json(wechatAuth);
  } catch (error: unknown) {
    const { message } = error as { message: string };

    logger.fatal({}, `Wechat login call /connect/qrconnect message:${message}`);

    return InternalServerErrorResponse(message);
  }
}
