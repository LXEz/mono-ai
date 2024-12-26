import { logger } from '@/lib/logger';

import { GET as GETCn } from '../auth/wechat/[lang]/route';

export const dynamic = 'force-dynamic';

/**
 * test url: http://localhost:3000/api/auth/wechat
 *            http://localhost:3000/api/auth/wechat?state=foobar
 *            http://localhost:3000/api/auth/wechat?state=foobar&code=
 * @param req
 * @returns
 */
export async function GET(req: Request) {
  logger.info({}, `Wechat req.url:${req.url}`);

  return GETCn(req, Promise.resolve({ params: { lang: undefined } }) as never);
}
