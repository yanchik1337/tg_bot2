import { google } from "googleapis";
import { required } from "../utils/env.js";
const client_id = required("GOOGLE_OAUTH_CLIENT_ID");
const client_secret = required("GOOGLE_OAUTH_CLIENT_SECRET");
const redirect_uri = required("GOOGLE_OAUTH_REDIRECT_URI");
const refresh_token = required("GOOGLE_OAUTH_REFRESH_TOKEN");
export const OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
OAuth2Client.setCredentials({
    refresh_token,
});
