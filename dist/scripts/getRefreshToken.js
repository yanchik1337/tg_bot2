import { google } from "googleapis";
import { required } from "../utils/env.js";
import "dotenv/config";
import http from "node:http";
const client_id = required("GOOGLE_OAUTH_CLIENT_ID");
const client_secret = required("GOOGLE_OAUTH_CLIENT_SECRET");
const redirect_uri = required("GOOGLE_OAUTH_REDIRECT_URI");
const scope_url = ["https://www.googleapis.com/auth/drive.file"];
const OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
const authURL = OAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scope_url,
});
async function getCode(url) {
    if (!url) {
        throw new Error(`URL не указан`);
    }
    const code = new URL(url, "http://localhost:3000").searchParams.get("code");
    if (!code) {
        throw new Error(`Произошла ошибка при запросе`);
    }
    const token = await OAuth2Client.getToken(code);
    const { tokens: { refresh_token }, } = token;
    console.log(refresh_token);
    return process.exit(0);
}
console.log(authURL);
const server = http.createServer(async (req, res) => {
    if (!req.url) {
        throw new Error("Произошла ошибка при запросе");
    }
    await getCode(req.url);
});
server.listen(3000);
