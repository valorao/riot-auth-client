import axios from 'axios';

export class GetPlayerBanner {
    handle = async (token: string, entitlements: string, puuid: string, version: string, platform: string) => {
        const url = `https://pd.na.a.pvp.net/personalization/v2/players/${puuid}/playerloadout`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': platform,
                'X-Riot-ClientVersion': version,
            }
        }
        const response  = await axios.get(url, config).catch(err => {return err.response});
        if (!response || !response.data || response.status !== 200) {
            return {
                status : response.status,
                message: response.data,
            }

        }
        const banner = response.data.Identity.PlayerCardID;
        const title = response.data.Identity.PlayerTitleID;
        return {
            playerbanner: banner,
            playertitle: title,
        };
    }
}
