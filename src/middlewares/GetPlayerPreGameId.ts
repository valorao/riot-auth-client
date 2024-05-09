import axios from 'axios';

export class GetPlayerPreGameId {
    PlayerPreGameId = async (token: string, puuid: string, entitlements: string, client_platform: string, client_version: string) => {
        try {
            const url = `https://glz-br-1.na.a.pvp.net/pregame/v1/players/${puuid}`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Riot-Entitlements-JWT': entitlements,
                    'X-Riot-ClientPlatform': client_platform,
                    'X-Riot-ClientVersion': client_version,
                    }
            };
    
        let response  = await axios.get(url, config).then(res => {
            return res
        }).catch(err => {
            return err.response
        });
        return response;
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}