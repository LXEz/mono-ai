import { Role } from "@/lib/conversational-dashboard/enums/role";
import { OpenType } from "./chatMessagesEvent";

export interface ChatMessageItem {
  question?: string;
  role?: Role;
  name: OpenType;
  done?: boolean;
  data: Record<string | OpenType, unknown> | string;
}
