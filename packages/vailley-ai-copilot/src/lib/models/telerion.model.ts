export type TelerionAuthDTO = {
  id: string;
  agent: string;
  node: string;
  data: {
    accessToken: string;
    refreshToken: string;
    account: string;
  };
} | null;

export type ChatTransferDTO = {
  message: string;
  redirectUrl?: string;
};

export type TelerionTranscript = {
  id: string;
  createdAt: string;
  sender: string;
  type: string;
  value: string;
};

export type TelerionVariable = {
  transcript: TelerionTranscript[];
  referenceNumber: string;
  language: string;
};
