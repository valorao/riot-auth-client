import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';
import { match } from 'assert';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();

export default class GetMatchHistory {
    handle = async (token: string, entitlements: string, puuid: string) => {
        try {
            const version_response = await getClientVersion.ClientVersion();
            const platform_response = await getClientPlatform.ClientPlatform();
            const version = version_response.data.data.riotClientVersion;
            const platform = platform_response.data.data.platform;

            const url = `https://pd.na.a.pvp.net/match-history/v1/history/${puuid}?startIndex=0&endIndex=1`
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
            if (response.status === 429) {
                return {
                    status: 429,
                    message: 'Rate limit exceeded',
                }
            }

            const matchid = response.data.History[0].MatchID;
            const unixTimeStamp = response.data.History[0].GameStartTime;
            const date = new Date(unixTimeStamp);
            const matchDate = date.toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'});
            return {
                status: response.status,
                lastMatch: matchid,
                lastMatchDate: matchDate,
            }
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
