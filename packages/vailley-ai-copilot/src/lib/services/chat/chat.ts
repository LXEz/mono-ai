import * as CONSTANTS from "@/lib/constants";
import * as Models from "@/lib/models";

export const getChatAnswer = async (
  question: string,
): Promise<Models.ChatAPIResponse> => {
  try {
    //const url = `${process.env.NEXT_PUBLIC_SUPERALPHA_API}${CONSTANTS.SUPERALPHA_CHAT}`;
    const url = `${CONSTANTS.REWRITE_SUPERALPHA_API}`;
    const reqHead = {
      "Content-Type": "application/json",
      "x-app-id": `${process.env.NEXT_PUBLIC_SENTIMENT_APP_ID}`,
      Authorization: `${CONSTANTS.SUPERALPHA_CHAT_Access} ${process.env.NEXT_PUBLIC_SENTIMENT_API_KEY}`,
    };
    const reqBody: Models.ChatAPIBody = {
      question,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: reqHead,
      //mode: 'no-cors',
      body: JSON.stringify(reqBody),
    });
    //debugger;
    if (!res.ok) {
      console.info(` getChatAnswer Fail : ${JSON.stringify(reqBody)}`);
      const data = await res.json();
      throw new Error(data.reason);
    }
    const data = (await res.json()) as Models.ChatAPIResponse;
    return data;
  } catch (error: any) {
    console.error(`Failed to getChatAnswer: ${error.message}`);
    return { error: CONSTANTS.SUPERALPHACHAT_ERROR };
  }
};
