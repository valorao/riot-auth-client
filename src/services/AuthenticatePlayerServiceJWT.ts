import cookie from 'cookie';
import { CreateCookie } from "./CreateCookie";
import GetClientVersion from "./GetClientVersionService";
import { AuthAccount } from "../middlewares/authAccount";
import { GetEntitlements } from "../middlewares/getEntitlements";
import { GetPlayerInfo } from "../middlewares/PlayerInfo";
import { EncryptJWT } from 'jose';
import 'dotenv/config';

const createCookie = new CreateCookie();
const getClientVersion = new GetClientVersion();
const authAccount = new AuthAccount();
const getEntitlements = new GetEntitlements();
const getPlayerInfo = new GetPlayerInfo();

export class AuthenticatePlayerServiceJWT {
    handle = async (username: string, password: string) => {
        if (!username || !password) {
            return {
                status: 400,
                message: 'Invalid username or password',
            };
        }
        try {
            const cookiesValue = await createCookie.handle();
            const version = await getClientVersion.ClientVersion();
            const clientversion = version.data.data.version;
            const response = await authAccount.AuthCookies(
                clientversion , username, password, cookiesValue || '').catch(err => {
                    return err.response;
                });
            if (response.response.status === 429) {
                return {
                    status: 429,
                    message: 'We are unable to process your request right now. - TOO_MANY_REQUESTS'
                }
            }
            if (response.response.data.type === 'multifactor') {
                return {
                    status: 403,
                    message: 'Disable Multifactor Authentication to continue. - MULTIFACTOR_ENABLED',
                }
            }
            if (response.response.data.error) {
                return {
                    status: 401,
                    message: 'Invalid username or password. - INVALID_REQUEST',
                };
            }
            const uri = response.response.data.response.parameters.uri;
            const url = new URL(uri);
            const params = new URLSearchParams(url.search);
            const token = params.get('access_token');
        
            const ent = await getEntitlements.Entitlements(token || '').catch(err => {
                return err.response;
            });
            const entitlements_token = ent.data.entitlements_token;
        
            const info = await getPlayerInfo.PlayerInfo(token || '').catch(err => {
                return err.response;
            });
            const ssid = response.ssid_cookie
            const ssidCookie = cookie.parse(ssid);
            const ssidValue = ssidCookie.ssid;
            const ssidExpiry = new Date();
            ssidExpiry.setDate(ssidExpiry.getDate() + 7);
            const puuid = info.data.sub;


            async function generateJWT(token: string, entitlements: string, puuid: string) {
                try {
                    const secretHex = process.env.SECRET;
                    const secret = Buffer.from((secretHex as string), 'hex');
                    const expiry = '1h';
    
                    const payload = {
                        token: token,
                        entitlements: entitlements,
                        puuid: puuid,
                        expiry: expiry,
                    }
                    let jwt = await new EncryptJWT(payload).setProtectedHeader({alg: 'dir', enc: 'A256GCM'})
                    .setExpirationTime(expiry)
                    .encrypt(secret);
                    return jwt;
                    
                } catch (err) {
                    console.log(err)
                    return { status: 500, message: (err as Error).message };
                }
            }
            const jwtresponse = await generateJWT((token as string), entitlements_token, puuid);
            return {
                status: 200,
                token: jwtresponse,
                cookie: ssidValue,
            }
        }
        catch (err) {
            console.log(err)
            return {
                 status: 500,
                  "error": "Internal Server Error.",
                  "message": "Internal Server Error. - SERVER_UNEXPECTED_ERROR"
                 };
        }
    }
}
