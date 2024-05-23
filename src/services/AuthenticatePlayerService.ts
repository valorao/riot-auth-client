import cookie from 'cookie';
import { CreateCookie } from "./CreateCookie";
import GetClientVersion from "./GetClientVersionService";
import { AuthAccount } from "../middlewares/authAccount";
import { GetEntitlements } from "../middlewares/getEntitlements";
import { GetPlayerInfo } from "../middlewares/PlayerInfo";
import 'dotenv/config';

const createCookie = new CreateCookie();
const getClientVersion = new GetClientVersion();
const authAccount = new AuthAccount();
const getEntitlements = new GetEntitlements();
const getPlayerInfo = new GetPlayerInfo();
const domain = process.env.DOMAIN || '.valorao.cloud';

export class AuthenticatePlayerService {
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
                    message: 'Disable Multifactor Authentication to continue',
                }
            }
            if (response.response.data.error) {
                return {
                    status: 401,
                    message: 'Invalid username or password',
                };
            }
            const uri = response.response.data.response.parameters.uri;
            const url = new URL(uri);
            const params = new URLSearchParams(url.search);
            const token = params.get('access_token');
            const expires = params.get('expires_in');
            const id_token = params.get('id_token');
        
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
            const riotid = info.data.acct.game_name + '#' + info.data.acct.tag_line;
            const expiry = new Date();
            expiry.setDate (expiry.getDate() + 7)
            response.token = [
                {
                    name: 'token',
                    value: token,
                    options: {
                        httpOnly: true,
                        expires: expiry,
                        // sameSite: 'None',
                        // secure: true,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];
            response.entitlements = [
                {
                    name: 'entitlements',
                    value: entitlements_token,
                    options: {
                        httpOnly: true,
                        expires: expiry,
                        // sameSite: 'None',
                        // secure: true,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];
            response.puuid = [
                {
                    name: 'puuid',
                    value: puuid,
                    options: {
                        httpOnly: true,
                        // sameSite: 'None',
                        // secure: true,
                        expires: expiry,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];
            response.ssid = [
                {
                    name: 'ssid',
                    value: ssidValue,
                    options: {
                        httpOnly: true,
                        expires: ssidExpiry,
                        // sameSite: 'None',
                        // secure: true,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SESSION-ONLY TOKENS:          
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            response.puuid_onetime = [
                {
                    name: 'puuid',
                    value: puuid,
                    options: {
                        httpOnly: true,
                        // sameSite: 'None',
                        // secure: true,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];
            response.ssid_onetime = [
                {
                    name: 'ssid',
                    value: ssidValue,
                    options: {
                        httpOnly: true,
                        // sameSite: 'None',
                        // secure: true,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];
            response.token_onetime = [
                {
                    name: 'token',
                    value: token,
                    options: {
                        httpOnly: true,
                        // sameSite: 'None',
                        // secure: true,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];
            response.entitlements_onetime = [
                {
                    name: 'entitlements',
                    value: entitlements_token,
                    options: {
                        httpOnly: true,
                        // sameSite: 'None',
                        // secure: true,
                        path: '/',
                        // domain: domain,
                    }
                }
            ];

            return {
                    tokenCookie: response.token,
                    entitlementsCookie: response.entitlements,
                    status: response.response.status,
                    puuidCookie: response.puuid,
                    ssidCookie: response.ssid,
                    ssid_onetimeCookie: response.ssid_onetime,
                    puuid_onetimeCookie: response.puuid_onetime,
                    token_onetimeCookie: response.token_onetime,
                    entitlements_onetimeCookie: response.entitlements_onetime,
                    riotid, puuid, token, expires, id_token, entitlements_token
                 };
        }
        catch (err) {
            console.log(err)
            return { status: 500, message: (err as Error).message };
        }
    }
}
