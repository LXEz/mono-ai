export enum ChatMessagesEvent {
  NULL = "",
  STEP_OPEN = "step_open",
  STEP_CLOSE = "step_close",
  STEP_MESSAGE = "step_message",
  MESSAGE = "message",
  START = "start",
  END = "end",
}

export enum OpenType {
  NULL = " ",
  Analysis = "Analysis",
  GenerateSQLWithQuestion = "Generate SQL With Quest",
  SQLData = "Handle Data From Database",
  SelectDashboard = "Select Dashboard",
  Echarts = "Echarts",
  DisplayInsight = "Display Insight",
  Invalid = "Invalid",
}

export interface ChatMessagesDataType {
  name: OpenType;
  id: number | string;
}
