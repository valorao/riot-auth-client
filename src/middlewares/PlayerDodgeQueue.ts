import axios from 'axios';

export class PlayerDodgeQueue {
    DodgeQueue = async (token: string, pregame_id: string, entitlements: string, client_platform: string, client_version: string) => {
        try {
            axios.defaults.baseURL = `https://glz-br-1.na.a.pvp.net/pregame/v1/matches/${pregame_id}/quit`;
            const riot_headers = {
                'Authorization': `Bearer ${token}`,
                'X-Riot-ClientPlatform': client_platform,
                'X-Riot-ClientVersion': client_version,
                'X-Riot-Entitlements-JWT': entitlements
            }
    
            let response = await axios.post(axios.defaults.baseURL, {}, {headers: riot_headers}).then(res => {
                return res;
            }).catch(err => {
                return err.response;
            });
            return response;
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
