import type { Context, SessionFlavor } from "grammy";

export interface SessionData {
  step: "idle" | "waitingForFolderName" | "waitingForVideo" | "waitingForEmail";
  pendingEmail: string;
}
export type BotContext = Context & SessionFlavor<SessionData>;
