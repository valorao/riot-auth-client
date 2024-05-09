import axios from 'axios';
import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();

export default class GetPlayerName {
    handle = async (token: string, entitlements: string, puuid: string) => {
        const version_response = await getClientVersion.ClientVersion();
        const platform_response = await getClientPlatform.ClientPlatform();
        const version = version_response.data.data.riotClientVersion;
        const platform = platform_response.data.data.platform;
        
        const url = `https://pd.na.a.pvp.net/name-service/v2/players`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': platform,
                'X-Riot-ClientVersion': version,
            }
        }
        const body = [
            puuid
        ]

        const nameresponse  = await axios.put(url, body, config).catch(err => {return err.response});
        if (!nameresponse || !nameresponse.data || nameresponse.status !== 200) {
            throw nameresponse.data;
        }
        const riotid = nameresponse.data[0].GameName;
        const tagline = nameresponse.data[0].TagLine;
        return {
            riotid: riotid,
            tagline: tagline,
        };
    }
}
