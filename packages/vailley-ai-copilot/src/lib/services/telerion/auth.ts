import { logger } from "@/lib/logger";
import * as Models from "@/lib/models";

export const getTelerionAuth = async (): Promise<Models.TelerionAuthDTO> => {
  try {
    const url = `${process.env.TELERION_API}/`;
    const tempRequestBody = {
      id: `${process.env.TELERION_LOGIN_API_ID}`,
      type: "request",
      method: "login",
      data: {
        type: "password",
        login: `${process.env.TELERION_LOGIN_API_LOGIN}`,
        domain: `${process.env.TELERION_LOGIN_DOMAIN}`,
        password: `${process.env.TELERION_LOGIN_API_PASSWORD}`,
      },
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tempRequestBody),
    });
    if (!res.ok) {
      logger.info(` getTelerion Auth: ${JSON.stringify(tempRequestBody)}`);
      const { message } = await res.json();
      throw new Error(message);
    }

    const data = (await res.json()) as any;

    return data;
  } catch (error: any) {
    logger.fatal(`Failed to getTelerionAuth: ${error.message}`);
    return null;
  }
};
