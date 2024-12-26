import { getQueryObject } from '@/lib/getQueryObject';
import { logger } from '@/lib/logger';
import { InternalServerErrorResponse } from '@/lib/response';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// type TAsyncParam = Promise<{ params: { lang: string | undefined } }>;

/**
 * 第一步：请求CODE，用户同意授权，获取code
 * https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
 *
 * test url: http://localhost:3000/api/auth/wechat
 *            http://localhost:3000/api/auth/wechat?state=foobar
 *            http://localhost:3000/api/auth/wechat?state=foobar&code=
 *
 * @param req
 * @param asyncParam
 * @returns
 */
// @ts-error
export async function GET(req: Request, asyncParam: never) {
  try {

    const param: { params: { lang: string | undefined } } = asyncParam;
    const lang = param.params?.lang;
    logger.info({}, `Wechat login param:${JSON.stringify(lang)}`);

    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_SECRET;
    const redirect_uri = process.env.WECHAT_LOGIN_REDIRECT_URL;

    const query = getQueryObject(req.url);

    const code = query?.code;

    if (code) {
      const searchParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        secret,
        appid,
      } as Record<string, string>);

      const url = `https://api.weixin.qq.com/sns/oauth2/access_token?${searchParams.toString()}`;

      const req = await fetch(url);

      const json = await req.json();

      logger.info({}, `Wechat login call /sns/oauth2/access_token url:${url}, req:${json}`);

      const res = NextResponse.json(json);

      ['access_token', 'refresh_token', 'openid', 'unionid', 'expires_in'].forEach((key) => {
        res.cookies.set(key, json[key]);
      });

      res.cookies.set('openid', json.openid, {});
      res.headers.set('Access-Control-Allow-Origin', 'https://chat.dzfm-ai.com');
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return NextResponse.json(json);
    } else {
      const searchParams = new URLSearchParams({
        appid,
        redirect_uri,
        response_type: 'code',
        scope: 'snsapi_login',
      } as Record<string, string>);

      if (lang) searchParams.append('lang', lang);
      if (query?.state) searchParams.append('state', query.state);

      const url = `https://open.weixin.qq.com/connect/qrconnect?${searchParams.toString()}#wechat_redirect`;

      logger.info({}, `Wechat login call /connect/qrconnect url:${url}`);

      return NextResponse.redirect(url);
    }
  } catch (error: unknown) {
    const { message } = error as { message: string };

    logger.fatal({}, `Wechat login call /connect/qrconnect message:${message}`);

    return InternalServerErrorResponse(message);
  }
}
