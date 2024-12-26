import { GET as GETCn } from './[lang]/route';

export const dynamic = 'force-dynamic';

/**
 * 第一步：请求CODE，用户同意授权，获取code
 * https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
 *
 * test url: http://localhost:3100/api/auth/wechat
 *            http://localhost:3100/api/auth/wechat?state=foobar
 *            http://localhost:3100/api/auth/wechat?state=foobar&code=
 *
 * @param req
 * @param asyncParam
 * @returns
 */
export async function GET(req: Request) {
  return GETCn(req, Promise.resolve({ params: { lang: undefined } }) as never);
}
