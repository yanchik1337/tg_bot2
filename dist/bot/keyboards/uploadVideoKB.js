import { Hears } from "../../consts/hears.js";
import { Keyboard } from "grammy";
export const uploadVideoKeyboard = new Keyboard()
    .text(Hears.UPLOAD_VIDEO)
    .resized()
    .persistent();
