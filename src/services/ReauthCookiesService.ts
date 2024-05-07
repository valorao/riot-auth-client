import axios from 'axios';
import { GetEntitlements } from '../middlewares/getEntitlements';

const getEntitlements = new GetEntitlements();

export class ReauthCookiesService {
    handle = async (ssid: string) => {
        console.log(ssid)
        const url = `https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid}`
        const config = {
            headers: {
                'Cookie': ssid
            },
            maxRedirects: 0
        };

        try {
            let response = await axios.get(url, config);
            return response;
        } catch (error) {
            if ((error as any).response && ((error as any).response.status === 301 || (error as any).response.status === 303)) {
                const redirectUrl = (error as any).response.headers.location;
                const urlObj = new URL(redirectUrl);
                const params = new URLSearchParams(urlObj.hash.substring(1)); // remove the leading '#'
                const accessToken = params.get('access_token');
                const ent = await getEntitlements.Entitlements(accessToken || '').catch(err => {
                    return err.response;
                });
                const entitlements_token = ent.data.entitlements_token;
                return {
                    data: {
                        accessToken: accessToken,
                        entitlements: entitlements_token
                    },
                    status: (error as any).response.status,
                    headers: (error as any).response.headers
                }
            } else {
                throw error;
            }
        }
    }
}