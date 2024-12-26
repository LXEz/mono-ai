import { logger } from '@/lib/logger';
import { InternalServerErrorResponse } from '@/lib/response';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      name: process.env.PACKAGE_NAME,
      version: process.env.PACKAGE_VERSION,
    });
  } catch (error: unknown) {
    const { message } = error as { message: string };
    logger.fatal({}, message);
    return InternalServerErrorResponse(message);
  }
}
