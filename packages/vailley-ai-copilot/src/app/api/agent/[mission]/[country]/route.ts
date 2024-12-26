import { logger } from '@/lib/logger';
import * as Models from '@/lib/models';
import { InternalServerErrorResponse } from '@/lib/response';
import { getLiveAgent } from '@/lib/services';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params: { mission, country } }: { params: { mission: string; country: string } },
) {
  try {
    const payload = await req.json();
    const transcript = payload.transcript;
    const referenceNumber = payload.referenceNumber;
    const language = payload.language;
    //if (req.headers.get('x-api-key') !== process.env.VAS_API_KEY!) {
    //  return UnauthorizedResponse();
    //}
    //Request Example
    //  {
    //    "referenceNumber":"GWF910016667",
    //    "transcript": [
    //            {
    //                "id": "a9be3e14-a332-43b2-8bd0-1e97bcf53a39",
    //                "createdAt": "2020-01-01T00:00:00.001Z",
    //                "question": "mesg msg text text text",
    //                "answer": "mesg msg text text text"
    //            }
    //        ]
    //}
    //Transfer To Example
    //  {
    //    "id": "a9be3e14-a332-43b2-8bd0-1e97bcf53a39",
    //    "createdAt": "2020-01-01T00:00:00.001Z",
    //    "sender": "Customer/bot",
    //    "type": "text",
    //    "value": "mesg msg text text text"
    //}
    let transcriptData: Models.TelerionTranscript[] = [];
    let tempMessage: any;
    transcript.forEach((message: any) => {
      if (message.question) {
        tempMessage = {
          id: message.id ?? '',
          createdAt: message.createdAt ?? '',
          sender: 'Customer',
          type: 'text',
          value: message.question ?? ''
        }
      } else if (message.answer) {
        tempMessage = {
          id: message.id ?? '',
          createdAt: message.createdAt ?? '',
          sender: 'bot',
          type: 'text',
          value: message.answer ?? ''
        }
      }
      transcriptData.push(tempMessage);

    });
    const agentPayload: Models.TelerionVariable = { transcript: transcriptData, referenceNumber, language };

    const data = await getLiveAgent(mission, country, agentPayload);
    const headers = {
      'Access-Control-Allow-Headers': 'content-type,refresh-token,x-app-id,authorization,x-chat-sid',
      'Access-Control-Allow-Origin': '*'
    };
    return NextResponse.json({ redirectUrl: data.redirectUrl, message: data.message }, { headers });
    //return Response.json({ redirectUrl: data.redirectUrl, message: data.message });
  } catch (error: any) {
    logger.fatal({ mission, country }, error.message);
    return InternalServerErrorResponse(error.message);
  }
}

export async function OPTIONS() {
  try {
    const headers = {
      'Access-Control-Allow-Headers': 'content-type,refresh-token,x-app-id,authorization,x-chat-sid',
      'Access-Control-Allow-Origin': '*'
    };
    return NextResponse.json({
      name: process.env.PACKAGE_NAME,
      version: process.env.PACKAGE_VERSION,
    }, { headers });
  } catch (error: any) {
    logger.fatal({}, error.message);
    return InternalServerErrorResponse(error.message);
  }
}
