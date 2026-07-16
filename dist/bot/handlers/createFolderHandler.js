import { AppDataSource } from "../../config/database.js";
import { OAuth2Client } from "../../config/google.js";
import { User } from "../../entities/User.js";
import { createFolder } from "../../services/googleDrive.js";
import { required } from "../../utils/env.js";
import { uploadVideoKeyboard } from "../keyboards/uploadVideoKB.js";
const redirect_uri = required("GOOGLE_OAUTH_REDIRECT_URI");
const client_id = required("GOOGLE_OAUTH_CLIENT_ID");
const client_secret = required("GOOGLE_OAUTH_CLIENT_SECRET");
const scope_url = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/userinfo.email",
];
export async function createFolderHandler(ctx, next) {
    const userRepository = AppDataSource.getRepository(User);
    const userId = String(ctx.from?.id);
    const userName = String(ctx.from?.first_name);
    const existingUser = await userRepository.findOne({
        where: { telegramId: userId },
    });
    if (!existingUser) {
        await ctx.reply(`"Вы не авторизованы. Сначала пройдите авторизацию.`);
        return;
    }
    const userToken = existingUser.googleAuthToken;
    if (!userToken) {
        const authURL = OAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scope_url,
            prompt: "consent select_account",
            state: userId,
        });
        await ctx.reply(`Необходимо авторизоваться в акканте: ${authURL}`);
        ctx.session.step = "waitingForGoogleAuth";
        return;
    }
    let currentUser;
    if (!existingUser) {
        currentUser = userRepository.create({
            telegramId: userId,
            username: userName,
        });
        await userRepository.save(currentUser);
    }
    else {
        currentUser = existingUser;
    }
    const data = String(ctx.message?.text);
    const newFolderId = await createFolder(data, userToken);
    currentUser.googleDriveFolderId = newFolderId;
    currentUser.googleDriveFolderName = data;
    await userRepository.save(currentUser);
    ctx.session.step = "waitingForVideo";
    await ctx.reply("Папка успешно создана, скидывай видос", {
        reply_markup: uploadVideoKeyboard,
    });
}
