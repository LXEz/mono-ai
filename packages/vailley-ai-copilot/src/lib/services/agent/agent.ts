import * as CONSTANTS from "@/lib/constants";
import { logger } from "@/lib/logger";
import * as Models from "@/lib/models";
import { v4 as uuidv4 } from "uuid";
import { getTelerionAuth } from "../telerion/auth";

export const getLiveAgent = async (
  mission: string,
  country: string,
  agentPayload: Models.TelerionVariable,
): Promise<Models.ChatTransferDTO> => {
  try {
    const contextID = uuidv4();
    const telerionAuthData = await getTelerionAuth();
    if (telerionAuthData == null) {
      throw new Error("Transfer auth fail");
    }
    const url = `${process.env.TELERION_API}/`;
    const agentVariables = agentPayload.referenceNumber
      ? {
        language: agentPayload.language,
        referenceNumber: `${agentPayload.referenceNumber}`,
        mission: mission,
        location: country,
        messages: agentPayload.transcript,
      }
      : {
        language: agentPayload.language,
        mission: mission,
        location: country,
        messages: agentPayload.transcript,
      };
    const reqHead = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${telerionAuthData.data.accessToken}`,
    };
    const reqBody = {
      id: `${telerionAuthData.data.account}`,
      type: "request",
      method: "scenarioInit",
      data: {
        scriptId: `${process.env.TELERION_SCENARIOINIT_API_SCRIPTID}`,
        contextId: contextID,
        variables: agentVariables,
      },
    };
    const res = await fetch(url, {
      method: "POST",
      headers: reqHead,
      body: JSON.stringify(reqBody),
    });
    //debugger;
    if (!res.ok) {
      logger.info(` getLiveAgent Fail : ${JSON.stringify(reqBody)}`);
      const data = await res.json();
      throw new Error(data.reason);
    }
    const data = (await res.json()) as any;
    let requestMessage = "";
    let redirectUrl = "";
    let errorMessageFromAPI = "";
    if (data.data && data.data.variables && data.data.variables.redirectUrl) {
      redirectUrl = `${data.data.variables.redirectUrl}&contextId=${contextID}`;
    } else {
      // none redirectUrl from telerion then need to display error message to user.
      //logger.warn(
      //  { mission, country },
      //  `Failed to getLiveAgent. error_code: ${data.data.variables?.error_code} Error: ${data.data.variables?.Error}`,
      //);
      logger.warn(
        { mission, country },
        `Failed to getLiveAgent. error: ${data.data.variables?.error}`,
      );
      // use default error message first
      requestMessage = CONSTANTS.TELERION_ERROR;
      // mapping from error_code way
      //if (data.data && data.data.variables && data.data.variables.error_code) {
      //  switch (data.data.variables.error_code) {
      //    case CONSTANTS.TELERION_LANGUAGE:
      //      requestMessage = CONSTANTS.TELERION_LANGUAGE_ERROR;
      //      errorMessageFromAPI = data.data.variables.error_description ?? "";
      //      break;
      //    case CONSTANTS.TELERION_OUT_OF_BUSINESS:
      //      requestMessage = CONSTANTS.TELERION_OUT_OF_BUSINESS_ERROR;
      //      errorMessageFromAPI = data.data.variables.error_description ?? "";
      //      break;
      //    default:
      //      break;
      //  }
      //}
      // mapping from Error way
      //if (
      //  errorMessageFromAPI.length <= 0 &&
      //  data.data &&
      //  data.data.variables &&
      //  data.data.variables.Error
      //) {
      //  errorMessageFromAPI = data.data.variables.Error;
      //}
      // mapping from error way  "{\"code\": \"403\", \"description\":\"Request out of business hours\"}"
      if (
        errorMessageFromAPI.length <= 0 &&
        data.data &&
        data.data.variables &&
        data.data.variables.error
      ) {
        const jsonString = data.data.variables.error;

        try {
          const obj = JSON.parse(jsonString);
          const code = obj.code;
          const description = obj.description;
          logger.info(`Error Code: ${code} Description: ${description}`);
          switch (code) {
            case `${CONSTANTS.TELERION_LANGUAGE}`:
              requestMessage = CONSTANTS.TELERION_LANGUAGE_ERROR;
              errorMessageFromAPI = description ?? "";
              break;
            case `${CONSTANTS.TELERION_OUT_OF_BUSINESS}`:
              requestMessage = CONSTANTS.TELERION_OUT_OF_BUSINESS_ERROR;
              errorMessageFromAPI = description ?? "";
              break;
            default:
              break;
          }
        } catch (error) {
          logger.fatal(`Error on parse: ${jsonString} Description: ${error}`);
        }
      }
      // assemble the final error message
      requestMessage =
        errorMessageFromAPI.length <= 0
          ? requestMessage
          : requestMessage +
          `    Here is the message from our live agent system: ${errorMessageFromAPI}`;
    }
    logger.info(
      { mission, country },
      `Message: ${requestMessage} redirectUrl: ${redirectUrl}`,
    );
    return { message: requestMessage, redirectUrl };
  } catch (error: any) {
    logger.fatal(
      { mission, country },
      `Failed to getLiveAgent: ${error.message}`,
    );
    return { message: CONSTANTS.TELERION_ERROR };
  }
};
