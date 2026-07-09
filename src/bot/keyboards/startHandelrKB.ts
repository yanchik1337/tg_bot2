import { Hears } from "../../consts/hears.js";
import { Keyboard } from "grammy";
export const startHanderlKeyboard = new Keyboard()
  .text(Hears.CREATE_FOLDER)
  .text(Hears.UPLOAD_VIDEO)
  .text(Hears.HELP)
  .resized()
  .persistent();
