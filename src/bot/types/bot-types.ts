import type { Context, SessionFlavor } from "grammy";

export interface SessionData {
  step: "idle" | "waitingForFolderName" | "waitingForVideo";
}
export type BotContext = Context & SessionFlavor<SessionData>;
