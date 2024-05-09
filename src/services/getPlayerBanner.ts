import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();

export default class GetPlayerBanner {
    handle = async (token: string, entitlements: string, puuid: string) => {
        try {
            const version_response = await getClientVersion.ClientVersion();
            const platform_response = await getClientPlatform.ClientPlatform();
            const version = version_response.data.data.riotClientVersion;
            const platform = platform_response.data.data.platform;
    
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
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
