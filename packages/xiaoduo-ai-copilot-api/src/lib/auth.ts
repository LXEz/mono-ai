import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';

const appid = process.env.WECHAT_APPID;
// const secret = process.env.WECHAT_SECRET;

async function checkToken(authInfo: Record<string, string>) {
  const searchParams = new URLSearchParams({
    access_token: authInfo?.access_token,
    openid: authInfo?.openid,
  });

  const checkUrl = `https://api.weixin.qq.com/sns/auth?${searchParams.toString()}`;

  const json = await fetch(checkUrl).then((res) => res.json());

  logger.info({}, `Wechat /sns/auth res:${JSON.stringify(json)}`);

  return json && json.errcode === 0;
}

async function refreshToken(authInfo: Record<string, string>) {
  const searchParams = new URLSearchParams({
    appid,
    refresh_token: authInfo?.refresh_token,
    grant_type: 'refresh_token',
  } as Record<string, string>);

  const checkUrl = `https://api.weixin.qq.com/sns/oauth2/refresh_token?${searchParams.toString()}`;

  const json = await fetch(checkUrl).then((res) => res.json());

  logger.info({}, `Wechat /sns/oauth2/refresh_token res:${JSON.stringify(json)}`);

  return json;
}

export async function auth(req: NextRequest) {
  const authInfo: Record<string, string> = {};

  ['access_token', 'refresh_token', 'openid', 'unionid', 'expires_in'].forEach((key: string) => {
    const value = req.headers.get(key);
    if (value && `${value}`.length > 0) authInfo[key] = value;

    const cookies = req.cookies.get(key);
    if (cookies?.value && `${cookies.value}`.length > 0) authInfo[key] = cookies?.value;
  });

  const json = await checkToken(authInfo);

  if (json && json.errcode === 0) {
    return await json;
  } else {
    return await { refresh: true, ...refreshToken(authInfo), errcode: 401 };
  }
}
